<script lang="ts">
  let { location = $bindable() }: { location: string } = $props();
</script>

<input class="border" type="text" bind:value={location} />

<style lang="postcss">
  input {
    background-color: transparent;
    font-size: inherit;
    color: inherit;
    border-style: solid;
    width: 100%;
    padding: 0.4em;
    border-radius: 0.3em;
  }
</style>
