#!/usr/bin/env python3
"""
Tiny mock backend server for Orcheeos Platform Dashboard testing.
Implements: /auth/login, /health, /chat/stream (SSE), /api/conversations, /artifacts/:id
Runs on port 8000 with CORS support.
"""

import json
import time
import uuid
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# In-memory storage
conversations_store = {}
artifacts_store = {}


def generate_mock_response(message):
    """Generate a mock streaming response based on the user message."""
    responses = [
        "Thank you for your message about '",
        message[:40],
        "'. Let me provide a comprehensive response.\n\n",
        "Here's an analysis of what you're asking about:\n\n",
        "## Key Points\n\n",
        "1. **First**, this involves understanding the core concepts and how they interconnect.\n",
        "2. **Second**, we need to consider the practical implications and trade-offs.\n",
        "3. **Third**, the implementation strategy depends on your specific use case and constraints.\n\n",
        "```python\n# Here is a simple example implementation\n",
        "def process_data(input_data):\n",
        '    """Process the input and return structured results."""\n',
        "    results = []\n",
        "    for item in input_data:\n",
        "        processed = transform(item)\n",
        "        results.append(processed)\n",
        "    return results\n\n",
        "def transform(item):\n",
        "    return {\n",
        "        'id': item.get('id'),\n",
        "        'value': item.get('value', 0) * 2,\n",
        "        'status': 'processed'\n",
        "    }\n",
        "```\n\n",
        "This is a flexible approach that can be adapted to many scenarios. ",
        "The key benefit is its simplicity and extensibility.\n\n",
        "Would you like me to elaborate on any specific aspect of this?"
    ]
    return ''.join(responses)


def tokenize_response(full_response, chunk_size=3):
    """Split response into SSE token chunks."""
    for i in range(0, len(full_response), chunk_size):
        yield full_response[i:i + chunk_size]


class MockHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        """Quiet logging."""
        print("[MockServer] {}".format(args[0]), file=sys.stderr)

    def _set_cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')

    def _send_json(self, data, status=200):
        self.send_response(status)
        self._set_cors()
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def _send_error_json(self, message, status=400):
        self._send_json({'detail': message}, status)

    def do_OPTIONS(self):
        self.send_response(204)
        self._set_cors()
        self.end_headers()

    def do_POST(self):
        parsed = urlparse(self.path)

        if parsed.path == '/auth/login':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length) if content_length else b'{}'
            try:
                data = json.loads(body)
            except json.JSONDecodeError:
                data = {}

            username = data.get('username', '').strip()
            password = data.get('password', '')

            if not username or not password:
                self._send_error_json('Username and password are required.', 422)
                return

            # Accept any credentials in mock mode
            token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ" + username + "Iiwicm9sZSI6ImRldmVsb3BlciJ9.mock-sig-" + uuid.uuid4().hex[:12]
            self._send_json({
                'access_token': token,
                'token_type': 'bearer',
                'username': username,
                'role': 'Developer',
            })

        elif parsed.path == '/api/conversations':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length) if content_length else b'{}'
            try:
                data = json.loads(body)
            except json.JSONDecodeError:
                data = {}

            conv_id = str(uuid.uuid4())
            title = data.get('title', 'New Conversation')
            conversation = {
                'id': conv_id,
                'title': title,
                'created_at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
                'updated_at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
                'messages': [],
            }
            conversations_store[conv_id] = conversation
            self._send_json({'conversation': conversation}, 201)

        else:
            self._send_error_json('Not found', 404)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        params = parse_qs(parsed.query)

        # Health check
        if path == '/health':
            self._send_json({
                'status': 'ok',
                'version': '1.0.0',
                'uptime': int(time.time()) % 86400,
                'timestamp': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
            })

        # Chat SSE stream
        elif path == '/chat/stream':
            message = params.get('message', ['Hello'])[0]
            conversation_id = params.get('conversation_id', [None])[0]

            # Send SSE headers
            self.send_response(200)
            self._set_cors()
            self.send_header('Content-Type', 'text/event-stream')
            self.send_header('Cache-Control', 'no-cache')
            self.send_header('Connection', 'keep-alive')
            self.send_header('X-Accel-Buffering', 'no')
            self.end_headers()

            full_response = generate_mock_response(message)

            # Stream tokens
            for token in tokenize_response(full_response, chunk_size=4):
                chunk = json.dumps({'token': token, 'content': token})
                self.wfile.write('data: {}\n\n'.format(chunk).encode())
                self.wfile.flush()
                time.sleep(0.03)  # Simulate streaming delay

            # Signal completion
            self.wfile.write(b'data: [DONE]\n\n')
            self.wfile.flush()

            # Create artifact for code-related messages
            msg_lower = message.lower()
            if 'code' in msg_lower or 'python' in msg_lower or 'script' in msg_lower:
                artifact_id = str(uuid.uuid4())
                artifact = {
                    'id': artifact_id,
                    'type': 'code',
                    'kind': 'python',
                    'title': 'generated_script.py',
                    'filename': 'generated_script.py',
                    'content': 'def process_data(input_data):\n    results = []\n    for item in input_data:\n        processed = transform(item)\n        results.append(processed)\n    return results\n\n\ndef transform(item):\n    return {\n        \'id\': item.get(\'id\'),\n        \'value\': item.get(\'value\', 0) * 2,\n        \'status\': \'processed\'\n    }',
                    'preview': 'def process_data(input_data):\n    """Process the input and return structured results."""\n    results = []\n    for item in input_data:\n        processed = transform(item)\n        results.append(processed)\n    return results',
                    'size': '342 bytes',
                }
                artifacts_store[artifact_id] = artifact
                chunk = json.dumps({'artifact': artifact})
                self.wfile.write('data: {}\n\n'.format(chunk).encode())
                self.wfile.flush()

        # List conversations
        elif path == '/api/conversations':
            convs = list(conversations_store.values())
            convs.sort(key=lambda c: c.get('updated_at', ''), reverse=True)

            # If empty, provide some mock conversations
            if not convs:
                for i in range(3):
                    conv_id = str(uuid.uuid4())
                    titles = [
                        'Exploring AI Orchestration Patterns',
                        'Python Data Pipeline Design',
                        'REST API Architecture Discussion',
                    ]
                    conv = {
                        'id': conv_id,
                        'title': titles[i],
                        'created_at': '2025-01-{:02d}T10:00:00Z'.format(15 - i),
                        'updated_at': '2025-01-{:02d}T14:30:00Z'.format(15 - i),
                    }
                    conversations_store[conv_id] = conv
                convs = list(conversations_store.values())

            self._send_json(convs)

        # Get specific conversation
        elif path.startswith('/api/conversations/'):
            conv_id = path.split('/')[-1]
            conv = conversations_store.get(conv_id)

            if not conv:
                self._send_error_json('Conversation not found', 404)
                return

            # Add mock messages if none exist
            if not conv.get('messages'):
                conv['messages'] = [
                    {'id': str(uuid.uuid4()), 'role': 'user', 'content': 'Hello! Can you help me with AI orchestration?'},
                    {'id': str(uuid.uuid4()), 'role': 'assistant',
                     'content': 'Of course! AI orchestration involves coordinating multiple AI agents and services to work together effectively. This includes task routing, resource management, and result aggregation.\n\nKey aspects:\n- **Task decomposition**: Breaking complex tasks into manageable subtasks\n- **Agent coordination**: Managing communication between AI agents\n- **Resource optimization**: Efficiently allocating compute and model resources'},
                ]

            # Attach artifacts if they exist
            conv_artifacts = list(artifacts_store.values())[:1] if artifacts_store else []
            result = dict(conv)
            result['artifacts'] = conv_artifacts
            self._send_json(result)

        # Get artifact
        elif path.startswith('/artifacts/'):
            parts = path.split('/')
            artifact_id = parts[2]

            artifact = artifacts_store.get(artifact_id)
            if not artifact:
                self._send_error_json('Artifact not found', 404)
                return

            # Handle download endpoint
            if len(parts) > 3 and parts[3] == 'download':
                content = artifact.get('content', '')
                self.send_response(200)
                self._set_cors()
                self.send_header('Content-Type', 'application/octet-stream')
                self.send_header('Content-Disposition',
                                 'attachment; filename="{}"'.format(artifact.get('filename', 'artifact.txt')))
                self.end_headers()
                self.wfile.write(content.encode())
            else:
                self._send_json(artifact)

        else:
            self._send_error_json('Not found', 404)

    def do_DELETE(self):
        parsed = urlparse(self.path)

        if parsed.path.startswith('/api/conversations/'):
            conv_id = parsed.path.split('/')[-1]
            if conv_id in conversations_store:
                del conversations_store[conv_id]
                self._send_json({'status': 'deleted'}, 200)
            else:
                self._send_error_json('Conversation not found', 404)
        else:
            self._send_error_json('Not found', 404)


def main():
    port = 8000
    server = HTTPServer(('0.0.0.0', port), MockHandler)
    print('[MockServer] Running on http://localhost:{}'.format(port))
    print('[MockServer] Endpoints:')
    print('  POST /auth/login')
    print('  GET  /health')
    print('  GET  /chat/stream?message=...')
    print('  GET  /api/conversations')
    print('  GET  /api/conversations/:id')
    print('  DELETE /api/conversations/:id')
    print('  GET  /artifacts/:id')
    print('  GET  /artifacts/:id/download')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\n[MockServer] Shutting down...')
        server.shutdown()


if __name__ == '__main__':
    main()
