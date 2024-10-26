<script lang="ts">
  let {
    columns=$bindable(),
    items,
  }: {
    items: any[];
    group: keyof any;
    columns: { label: string; field: keyof any }[];
  } = $props();
  let widths: number[] = $state([]);
  let dragging: {index:number,offset:number} |null= $state(null)
//   let offsets:number[] = $state([])
//   $effect(() => {
//     offsets = columns.map(() => 0);
//   });

function getOffset(index:number){
    if(dragging){
        if(dragging.index==index){return dragging.offset}

        // const r_offset = widths.slice(index,-1).reduce((a,b)=>a+b,0)
        const w_05 = widths[dragging.index]/2
        const dragging_total = widths.slice(0,dragging.index).reduce((a,b)=>a+b,0)+(dragging.offset<0?-w_05:w_05)
        const offset_total = widths.slice(0,index).reduce((a,b)=>a+b,0)
        if(dragging.offset<0){
            if(index<=dragging.index){
                if((dragging_total+dragging.offset)<offset_total){
                    return widths[dragging.index]
                }
            }
        }else{
            if(index>=dragging.index){
                if((dragging_total+dragging.offset)>offset_total){
                    return -widths[dragging.index]
                }
            }
        }
    }
    return 0
    
}
</script>

<svelte:window />
<svelte:document class="{dragging?"!cursor-grabbing":""}"/>
<div>{dragging?.offset}&nbsp;</div>
<div class="flex flex-col w-max ">
  <div class="flex flex-row">
    {#each columns as column, i (column)}
      <div
        bind:offsetWidth={widths[i]}
        style="width: {widths[i]||120}px; left: {getOffset(i)}px;"
        class="relative flex flex-row border-x  transition-left transition-delay-0 {dragging?.index==i?'transition-duration-none':'transition-duration-400'} "
      >
        <button 
        onmousedown={()=>{
            dragging={index:i,offset:0}
            const mousemove:Window['onmousemove']=(e) => {
                if(!dragging){return}
                dragging!.offset+=e.movementX
            }
            const mouseup:Window['onmouseup'] = ()=>{
                if(!dragging){return}
                const w_05 = widths[dragging.index]/2
                const dragging_total = widths.slice(0,dragging.index).reduce((a,b)=>a+b,0)+(dragging.offset<0?-w_05:w_05)
                let final = {index:0,offset:0}
                for(const w of widths){
                    if((dragging_total+dragging.offset)<final.offset){
                        break
                    }
                    final.offset+=w
                    final.index+=1
                }
                const rel_index = (final.index-dragging.index)
                const cs = $state.snapshot(columns)
                const column = cs.splice(dragging.index,1)[0]
                const w = widths.splice(dragging.index,1)[0]
                const del = rel_index>=0?-1:0
                cs.splice(final.index+del,0,column)
                columns = cs
                widths.splice(final.index+del,0,w)
                dragging=null
                window.removeEventListener("mousemove",mousemove)
            }
            window.addEventListener("mousemove", mousemove);
            window.addEventListener("mouseup",mouseup,{once:true})
        }}
        class="flex-grow px-2 truncate">{column.label}</button>
        <button
          onmousedown={() => {
            const mousemove:Window['onmousemove']=(e) => {
                widths[i] = Math.max(0,widths[i]+e.movementX) 
            }
            const mouseup:Window['onmouseup'] = ()=>{
                window.removeEventListener("mousemove",mousemove)
            }
            window.addEventListener("mousemove", mousemove);
            window.addEventListener("mouseup",mouseup,{once:true})
          }}
          class="border border-none w-2 float-end absolute -right-1 h-full hover:bg-red/0 z-50 cursor-col-resize {dragging?"pointer-events-none":""}"
          aria-label="drag"
        ></button>
      </div>
    {/each}
  </div>
  {#each items as item}
    <div class="flex flex-row w-inherit">
      {#each columns as column, i}
        <div style="width: {widths[i]}px;" class="border-x border-transparent px-2 truncate">
          {item[column.field]}
        </div>
      {/each}
    </div>
  {/each}
</div>

<style lang="ts">
  :root {
    --bg: rgb(25 25 25);
    --bg-hover: rgb(61, 61, 61);
    --border: rgb(202, 202, 202);
  }
</style>
