const fs = require('fs');
const path = require('path');
const os = require('os');

class DatabricksTransformer {
    constructor(options = {}) {
      this.name = 'databricks-custom';
      this.options = {
        debug: false,
        ...options
      };
      this.logFile = path.join(os.homedir(), '.claude-code-router/plugin.log');
  
  
      this.log('Initialized Databricks Custom Transformer');
    }
  
    log(...args) {
      if (this.options.debug) {
        const timestamp = new Date().toISOString();
        const message = `[${timestamp}] [DatabricksTransformer] ${args.join(' ')}\n`;
        
        try {
          fs.appendFileSync(this.logFile, message);
        } catch (error) {
          console.error('Failed to write to log file:', error);
        }
        
        console.log('[DatabricksTransformer]', ...args);
      }
    }

     /**
   * Transform Claude/OpenAI request to Databricks format
   * CCR calls this method: transformRequestIn
   */
  async transformRequestIn(request, provider) {
    this.log('transformRequestIn called - Transforming request:', JSON.stringify(request, null, 2));
    this.log('Provider object:', JSON.stringify(provider, null, 2));

    try {
      
      // FIXED: Construct proper Databricks URL with fallback
      const url = provider.api_base_url;
      this.log('Target URL:', url);



      // remove messages which have empty text block
      // Remove messages with empty content and strip cache_control from all messages
      request.messages = request.messages
        .map(message => {
    
          // FIXED: Handle empty content for tool calls the message content should be null and not empty string
          if (message.content === "")  {
            message.content = null;
          }
          if (Array.isArray(message.content)) {
            // Handle content arrays - remove cache_control from each content item
            message.content = message.content.map(contentItem => {
                if (contentItem.type === "image_url" && !contentItem.image_url.url.includes("base64")) {
                    const url = contentItem.image_url.url
                    const urlParts = url.split(",")
                    const urlFixed = urlParts[0] + ";" + "base64";
                    const finalUrl = urlFixed + "," + urlParts[1];
                    contentItem.image_url.url = finalUrl;
                }
            
              const { cache_control, ...cleanContentItem } = contentItem;
              return cleanContentItem;
            });
          }
          // Also remove cache_control from the message level if it exists
          const { cache_control, ...cleanMessage } = message;
          return cleanMessage;
        });

      const { parallel_tool_calls, ...cleanRequest } = request;

      this.log('Databricks request body:', JSON.stringify(request, null, 2));

      return {
        ...request,
      };

    } catch (error) {
      this.log('Error in transformRequestIn - Databricks:', error);
      throw error;
    }
  }
}

module.exports = DatabricksTransformer;