// Gemini AI Service Integration
interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

interface GeminiError {
  error: {
    code: number;
    message: string;
    status: string;
  };
}

export class GeminiAIService {
  private apiKey: string;
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateContent(prompt: string): Promise<string> {
    const url = `${this.baseUrl}/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
    
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData: GeminiError = await response.json();
        throw new Error(`Gemini API Error: ${errorData.error.message}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('No content generated from Gemini API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }

  async generateWebsiteCode(description: string): Promise<{
    html: string;
    css: string;
    javascript: string;
  }> {
    const prompt = `Create a complete, modern, and professional website based on this description: "${description}"

Please generate:
1. Complete HTML structure with semantic markup
2. Modern CSS with responsive design and beautiful styling
3. Interactive JavaScript functionality

Requirements:
- Use modern HTML5 semantic elements
- Include responsive design with mobile-first approach
- Use modern CSS features like Grid and Flexbox
- Include smooth animations and transitions
- Add interactive JavaScript features
- Use a modern color scheme and typography
- Ensure accessibility best practices
- Make it visually appealing and professional

Format your response as JSON with three separate sections:
{
  "html": "complete HTML code here",
  "css": "complete CSS code here", 
  "javascript": "complete JavaScript code here"
}

Make sure the code is production-ready, well-commented, and follows best practices.`;

    try {
      const response = await this.generateContent(prompt);
      
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not parse JSON response from Gemini');
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);
      
      return {
        html: parsedResponse.html || '<!DOCTYPE html><html><head><title>Generated Website</title></head><body><h1>Error generating HTML</h1></body></html>',
        css: parsedResponse.css || '/* Error generating CSS */',
        javascript: parsedResponse.javascript || '// Error generating JavaScript'
      };
    } catch (error) {
      console.error('Error generating website code:', error);
      
      // Return fallback code
      return {
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>AI-Generated Website</h1>
        <p>Built based on: ${description}</p>
        <button onclick="handleClick()">Click me!</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
        css: `.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
  color: #333;
  text-align: center;
}

button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: transform 0.2s;
}

button:hover {
  transform: translateY(-2px);
}`,
        javascript: `function handleClick() {
  alert('Hello from your AI-generated website!');
  console.log('Button clicked:', new Date());
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  console.log('Website loaded successfully');
});`
      };
    }
  }
}

// Create singleton instance
const geminiService = new GeminiAIService(process.env.GEMINI_API_KEY || '');

export default geminiService;
