<script>
export default {
    data()
    {
        let d = {};
        return d;
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
          <label for="endpoint" class="form-label">Endpoint</label>
          <input type="text" class="form-control" id="endpoint">
        </div>
        <div>
          <label for="key" class="form-label">Key</label>
          <input type="password" class="form-control" id="key">
        </div>
        <div>
          <label for="deploymentName" class="form-label">Deployment name</label>
          <input type="text" class="form-control" id="endpoint">
        </div>
        <div>
          <label for="readonly-text" class="form-label"></label>
          <textarea class="form-control" id="readonly-text" rows="25" readonly></textarea>
        </div>
        <br/>
        <div class="input-group">
          <textarea type="text" class="form-control" placeholder="Tchat with your model :-)" rows="5"></textarea>
          <button class="btn btn-outline-secondary" type="button" id="clear">Clear</button>
          <button class="btn btn-outline-secondary" type="button" id="send">Send</button>
        </div>
      </div>
      <div class="col">
      </div>
    </div>
  </div>
</template>


<style scoped>

</style>