<script lang="ts">
  import FileSystemTable, {
    type FileSystemTableColumn,
  } from "./file-system-table/FileSystemTable.svelte";
  import sample_data from "./sample-data.json";
  let columns: FileSystemTableColumn[] = $state([]);
  $effect(() => {
    columns = Array.from(
      sample_data.reduce(
        (set, item) => set.union(new Set(Object.keys(item))),
        new Set<string>([])
      )
    ).map<FileSystemTableColumn>((label) => ({
      label: label,
      sort: "asc",
      field: label,
    }));
  });
  const items: any[] = $derived(sample_data);
</script>

<FileSystemTable bind:columns {items} />

<style lang="postcss">
  :global {
    :root {
      --c-bg-1: rgb(17, 17, 17);
      --c-bg-2: rgb(39, 39, 39);
      --c-bg-3: rgb(56, 56, 56);
      --c-border: rgb(66, 66, 66);
      --c-content: rgb(255, 255, 255);
      background-color: var(--c-bg-1);
      font-family:
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        Oxygen,
        Ubuntu,
        Cantarell,
        "Open Sans",
        "Helvetica Neue",
        sans-serif;
      color: var(--c-content);
    }
    * {
      box-sizing: border-box;
      color: inherit;
      border-width: thin;
      border-style: none;
      border-color: inherit;
    }

    button {
      padding: unset;
      font-family: inherit;
      font-size: inherit;
      border-style: solid;
      background-color: var(--c-bg-2);
      &:hover {
        background-color: var(--c-bg-3);
      }
    }
  }
</style>
