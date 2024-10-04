<script>
export default {
  data()
  {
    let d = {};
    d.instanceName = "poc-003";
    d.key = "";
    d.deploymentName = "gpt-4t";
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
      if(!this.controlDisabled)
        this.controlDisabled = true;
      this.inputDisabled = true;

      if (this.discussion.length == 0)
      {
        this.discussion.push({ "role": "system", "content": this.systemMessage });
      }

      let tmpMessage = this.message;
      this.message = "";
      this.discussion.push({ "role": "user", "content": tmpMessage });

      let d =
      {
        n: 1,
        messages: JSON.parse(JSON.stringify(this.discussion))
      };
      
      let url = "https://{instanceName}.openai.azure.com/openai/deployments/{deploymentName}/chat/completions?api-version=2024-06-01";
      let fullpath = url.replace("{instanceName}", this.instanceName).replace("{deploymentName}", this.deploymentName);

      let response = await fetch(fullpath,
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

      // Add the discussion to the list only if no errors
      if (response.error)
        alert(JSON.stringify(response.error));
      else
        this.discussion.push({ "role": "assistant", "content": response.choices[0].message.content });
      
      this.inputDisabled = false;
    }
  }
}
</script>


<template>
    <div class="container">
    <div class="row">
      <br/>
    </div>
    <div class="row">
      <div class="col">
      </div>
      <div class="col-6">
        <div>
          <label for="instanceName" class="form-label">AOAI Instance Name</label>
          <input type="text" class="form-control" id="instanceName" v-model="instanceName" :disabled="controlDisabled">
        </div>
        <div>
          <label for="key" class="form-label">AOAI API Key</label>
          <input type="password" class="form-control" id="key" v-model="key" :disabled="controlDisabled">
        </div>
        <div>
          <label for="deploymentName" class="form-label">Deployment name</label>
          <input type="text" class="form-control" id="deployment" v-model="deploymentName" :disabled="controlDisabled">
        </div>
        <div>
          <label for="system" class="form-label">System Message</label>
          <textarea class="form-control" id="system" rows="5" v-model="systemMessage" :disabled="controlDisabled"></textarea>
        </div>
        <div>
          <label for="readonly-text" class="form-label"></label>
          <textarea class="form-control" id="readonly-text" rows="20" readonly v-model="discussionToHtml"></textarea>
        </div>
        <br/>
        <div class="input-group">
          <input type="text" class="form-control" placeholder="Tchat with your model :-)"  @keyup.enter="send" v-model="message" :disabled="inputDisabled"/>
          <button class="btn btn-outline-secondary" type="submit" id="send" @click="send" :disabled="inputDisabled">Send</button>
        </div>
      </div>
      <div class="col">
      </div>
    </div>
  </div>
</template>


<style scoped>

</style>