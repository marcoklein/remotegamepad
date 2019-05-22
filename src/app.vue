<template lang="pug">
    div {{testString}}
</template>


<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    data() {
        return {
            testString: 'hallo'
        }
    }
});
</script>

