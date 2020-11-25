<template>
  <div>
    test
  </div>
</template>

<script>
import {getRequest} from "@/utils/api";

export default {
  name: "Test",
  mounted() {
    getRequest("/employee/advanced/hello")
        .then(data => {
          if (data) {
            console.log(data);
          }
        })
  }
}
</script>

<style scoped>

</style>