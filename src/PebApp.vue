<script>
export default {
  data()
  {
    let d = {};
    d.instanceName = "";
    d.key = "";
    d.deploymentName = "";
    d.systemMessage = "";
    d.discussion = [];
    d.message = "";
    d.controlDisabled = false;
    d.inputDisabled = false;
    return d;
  },
  computed:
  {
    discussionToHtml()
    {
      let html = "";
      for (let o of this.discussion)
      {
        if (o.role == "user")
          html += "You: " + o.content + "\n";
        else if (o.role == "assistant")
          html += "Model: " + o.content + "\n";
      }
      return html;
    }
  },
  methods:
  {
    async send()
    {
      if (this.instanceName.length == 0 || this.key.length == 0 || this.deploymentName.length == 0)
      {
        alert("Please fill all the fields");
        return;
      }

      if (this.message.length == 0)
      {
        alert("Please enter a message");
        return;
      }

      if(!this.controlDisabled)
        this.controlDisabled = true;
      this.inputDisabled = true;

      // Add the System Message only once
      if (this.discussion.length == 0 && this.systemMessage.length > 0)
      {
        this.discussion.push({ "role": "system", "content": this.systemMessage });
      }

      // Add the input message to the discussion
      let tmpMessage = this.message;
      this.message = "";
      this.discussion.push({ "role": "user", "content": tmpMessage });

      // Send to the API !
      let d =
      {
        n: 1,
        messages: JSON.parse(JSON.stringify(this.discussion))
      };
      
      let url = "https://{instanceName}.openai.azure.com/openai/deployments/{deploymentName}/chat/completions?api-version=2024-06-01";
      let fullpath = url.replace("{instanceName}", this.instanceName).replace("{deploymentName}", this.deploymentName);

      let response = null;
      try
      {
        response = await fetch(fullpath,
        {
          method: "POST",
          headers:
          {
            "Content-Type": "application/json",
            "api-key": this.key
          },
          body: JSON.stringify(d)
        });
        response = await response.json();
      }
      catch (e)
      {
        response = { "error": e.message };
      }

      // Add the discussion to the list only if no errors
      if (!response.error)
        this.discussion.push({ "role": "assistant", "content": response.choices[0].message.content });
      else
      {
        this.controlDisabled = false; // unlock the controls
        this.discussion = [];         // empty the discussion
        alert("Error calling the API: " + JSON.stringify(response.error));
      }
      
      this.inputDisabled = false;
    }
  }
}
</script>


<template>
  <div class="outer-container">
    <div class="input-container">
      <input class="input-field input-field-left" type="text" id="instanceName" v-model="instanceName" :disabled="controlDisabled" placeholder="Instance Name">
      <input class="input-field" type="password" id="key" v-model="key" :disabled="controlDisabled" placeholder="API Key">
      <input class="input-field input-field-right" type="text" id="deployment" v-model="deploymentName" :disabled="controlDisabled" placeholder="Deployment name">
    </div>

    <div class="systemmessage-container">
      <label class="app-label" for="system">System Message</label>
      <textarea class="systemmessage-textarea" id="system" rows="5" v-model="systemMessage" :disabled="controlDisabled"></textarea>
    </div>

    <div>
      <label for="readonly-text"></label>
      <textarea id="readonly-text" rows="20" readonly v-model="discussionToHtml"></textarea>
    </div>

    <div >
      <input type="text" placeholder="Tchat with your model :-)"  @keyup.enter="send" v-model="message" :disabled="inputDisabled"/>
      <button type="submit" id="send" @click="send" :disabled="inputDisabled">Send</button>
    </div>
  </div>
</template>

<style scoped>

.outer-container {
  margin: 0 30%;
}

.input-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.input-field {
  width: 30%;
  border: none;
  border-bottom: 2px solid #7d7d7d;
  background-color: #ebebeb;
  padding: 5px;
  font-family: Verdana, sans-serif;
}
.input-field-left {
  border-radius: 5px 0 0 0;
}

.input-field-right {
  border-radius: 0 5px 0 0;
}

.systemmessage-container {
  margin-top: 20px;
  width: 100%;
}

.systemmessage-textarea {
  width: 100%;
  height: calc(3 * 1.5em); /* Assuming input height is 1.5em */
  border: none;
  border-bottom: 2px solid #7d7d7d;
  background-color: #f0f0f0;
  border-radius: 0 0 0 0;
  padding: 5px;
  font-family: Verdana, sans-serif;
  resize: none;
}

.app-label {
  font-family: Verdana, sans-serif;
  display: block;
  margin-bottom: 5px;
  font-size: 0.8em;
  color: #7d7d7d;
}

</style>