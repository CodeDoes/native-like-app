<script lang="ts">
  import FileSystemTable from "./FileSystemTable.svelte";
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
