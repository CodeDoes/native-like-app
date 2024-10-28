<script lang="ts">
  import FileSystemTable from "./file-system-table/FileSystemTable.svelte";
  const group = $state(0);
  let columns = $state([
    {
      sort: "asc",
      label: "Column 0",
      field: 1,
    },
    {
      sort: "asc",
      label: "Column 1",
      field: 2,
    },
    {
      sort: "asc",
      label: "Column 2",
      field: 3,
    },
    {
      sort: "asc",
      label: "Column 3",
      field: 4,
    },
    {
      sort: "asc",
      label: "Column 4",
      field: 5,
    },
  ]);

  const items = $state(
    [...new Array(3)].flatMap((_, g) =>
      [...new Array(5)].map((_, i) => [
        g,
        ...[...new Array(5)].map((_, j) => `${g} Cell ${i} ${j}`),
      ])
    )
  );
</script>

<FileSystemTable {group} bind:columns {items} />

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
