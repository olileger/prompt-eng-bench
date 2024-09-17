<script>
export default {
  data()
  {
    let d = {};
    d.instanceName = "";
    d.key = "";
    d.deploymentName = "";
    d.discussion = [];
    d.message = "";
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
        else
          html += "Model: " + o.content + "\n";
      }
      return html;
    }
  },
  methods:
  {
    async send()
    {
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

      if (response.error)
      {
        alert(JSON.stringify(response.error));
        return;
      }

      // Add the discussion to the list only if no errors
      this.discussion.push({ "role": "assistant", "content": response.choices[0].message.content });
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
          <input type="text" class="form-control" id="instanceName" v-model="instanceName">
        </div>
        <div>
          <label for="key" class="form-label">AOAI API Key</label>
          <input type="password" class="form-control" id="key" v-model="key">
        </div>
        <div>
          <label for="deploymentName" class="form-label">Deployment name</label>
          <input type="text" class="form-control" id="deployment" v-model="deploymentName">
        </div>
        <div>
          <label for="readonly-text" class="form-label"></label>
          <textarea class="form-control" id="readonly-text" rows="20" readonly v-model="discussionToHtml"></textarea>
        </div>
        <br/>
        <div class="input-group">
          <input type="text" class="form-control" placeholder="Tchat with your model :-)" v-model="message"/>
          <button class="btn btn-outline-secondary" type="submit" id="send" @click="send">Send</button>
        </div>
      </div>
      <div class="col">
      </div>
    </div>
  </div>
</template>


<style scoped>

</style>