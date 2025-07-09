import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
  template_id: 'default' | 'contact' | 'inquiry' | 'support';
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  submissionId?: string;
  messageId?: string;
  processingTime?: number;
  timestamp?: string;
  details?: any;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: '',
    company: '',
    template_id: 'default'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);

  // Get the current WebContainer API URL
  const getApiUrl = () => {
    // Use the live Render API URL
    return 'https://web3pro.onrender.com';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponse(null);

    try {
      const apiUrl = `${getApiUrl()}/submit-form`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: ApiResponse = await response.json();
      setResponse(data);

      if (data.success) {
        // Reset form on success
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          phone: '',
          company: '',
          template_id: 'default'
        });
      }
    } catch (error) {
      setResponse({
        success: false,
        error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const testConnection = async () => {
    try {
      const apiUrl = `${getApiUrl()}/health`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      setResponse({
        success: true,
        message: `Server is healthy! Status: ${data.status}, Uptime: ${Math.round(data.uptime)}s`,
      });
    } catch (error) {
      setResponse({
        success: false,
        error: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Express.js Form Backend Demo
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Test the production-ready form submission API with Gmail integration
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={testConnection}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              🚀 Test Live API
            </button>
            <div className="px-6 py-3 bg-blue-100 rounded-lg text-sm text-blue-800 font-mono">
              🌐 Live API: {getApiUrl()}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Submit Form</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your company"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template
                </label>
                <select
                  name="template_id"
                  value={formData.template_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="default">Default Template</option>
                  <option value="contact">Contact Form</option>
                  <option value="inquiry">Business Inquiry</option>
                  <option value="support">Support Request</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your message here..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Form
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Response Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">API Response</h2>
            
            {response ? (
              <div className={`p-6 rounded-lg border-l-4 ${
                response.success 
                  ? 'bg-green-50 border-green-400' 
                  : 'bg-red-50 border-red-400'
              }`}>
                <div className="flex items-center gap-2 mb-4">
                  {response.success ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  )}
                  <h3 className={`text-lg font-semibold ${
                    response.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {response.success ? 'Success!' : 'Error'}
                  </h3>
                </div>
                
                <div className="space-y-2 text-sm">
                  {response.message && (
                    <p className={response.success ? 'text-green-700' : 'text-red-700'}>
                      <strong>Message:</strong> {response.message}
                    </p>
                  )}
                  {response.error && (
                    <p className="text-red-700">
                      <strong>Error:</strong> {response.error}
                    </p>
                  )}
                  {response.hint && (
                    <p className="text-amber-700 bg-amber-50 p-2 rounded">
                      <strong>💡 Hint:</strong> {response.hint}
                    </p>
                  )}
                  {response.submissionId && (
                    <p className="text-green-700">
                      <strong>Submission ID:</strong> {response.submissionId}
                    </p>
                  )}
                  {response.messageId && (
                    <p className="text-green-700">
                      <strong>Gmail Message ID:</strong> {response.messageId}
                    </p>
                  )}
                  {response.processingTime && (
                    <p className="text-green-700">
                      <strong>Processing Time:</strong> {response.processingTime}ms
                    </p>
                  )}
                  {response.timestamp && (
                    <p className="text-gray-600">
                      <strong>Timestamp:</strong> {new Date(response.timestamp).toLocaleString()}
                    </p>
                  )}
                </div>

                {response.details && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium text-gray-600">
                      View Details
                    </summary>
                    <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                      {JSON.stringify(response.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Send className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Submit the form to see the API response here</p>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
                  <p><strong>📝 Setup Required:</strong></p>
                  <p>To send emails, configure your Gmail API credentials in the server/.env file</p>
                  <p>See USERGUIDE.md for detailed setup instructions</p>
                </div>
              </div>
            )}

            {/* API Usage Instructions */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Using this API from another site:</h4>
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Endpoint:</strong> <code className="bg-white px-2 py-1 rounded">{getApiUrl()}/submit-form</code></p>
                <p><strong>Method:</strong> POST</p>
                <p><strong>Content-Type:</strong> application/json</p>
                <p><strong>Required fields:</strong> name, email, subject, message</p>
                <p><strong>Optional fields:</strong> phone, company, template_id</p>
                <p><strong>⚠️ Note:</strong> Gmail API must be configured for email sending to work</p>
              </div>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Integration Examples</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">JavaScript/Fetch</h3>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`fetch('${getApiUrl()}/submit-form', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Hello',
    message: 'Test message',
    template_id: 'contact'
  })
})
.then(response => response.json())
.then(data => console.log(data));`}
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">cURL</h3>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`curl -X POST ${getApiUrl()}/submit-form \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Hello",
    "message": "Test message",
    "template_id": "contact"
  }'`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;