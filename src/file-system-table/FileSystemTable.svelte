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
  let dragging: {action:"move"|"resize", index:number,offset:number} |null= $state(null)
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
function getWidth(index:number){
  return widths[index]==undefined&&120||widths[index]
}
</script>

<svelte:window />
<svelte:document class="{dragging?"!cursor-grabbing":""}"/>
<div>{dragging?.offset}&nbsp;</div>
<div class="file-system-table" style="grid-template-columns: {columns.map((_,i)=>`minmax(4em,${getWidth(i)}px)`).join(' ')};">
  <div class="header-bar">
    {#each columns as column, i (column)}
      <button
        bind:offsetWidth={widths[i]}
        style=" left: {getOffset(i)}px;"
        data-dragging={dragging?.index==i}
        class="header-cell"
        title={column.label}
      >
        <div 
        role="button"
        tabindex="-1"
        onmousedown={()=>{
          if(dragging){return}
            dragging={index:i,offset:0,action:"move"}
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
        class="label">{column.label}</div>
        <div
          class="drag-area "
        role="button"
        tabindex="-1"
          onmousedown={(e) => {
            if(dragging){return}
            dragging = {action:"resize",index:i,offset:0}
            e.preventDefault()
            const mousemove:Window['onmousemove']=async (e) => {
                widths[i] = Math.max(0,widths[i]+e.movementX) 
                console.log(i,e.movementX)
            }
            const mouseup:Window['onmouseup'] = ()=>{
                window.removeEventListener("mousemove",mousemove)
                dragging=null
            }
            window.addEventListener("mousemove", mousemove);
            window.addEventListener("mouseup",mouseup,{once:true})
          }}
          aria-label="drag"
        ></div>
      </button>
    {/each}
  </div>
  {#each items as item}
    <div class="content-row">
      {#each columns as column}
        <div class="content-cell">
          {item[column.field]}
        </div>
      {/each}
    </div>
  {/each}
</div>
<style lang='postcss'>
  .content-row{
    display: contents;
  }
  .content-cell{
    width: 100%;
    display: inline-block;
    border-inline-end: thin solid transparent;
  }
  .file-system-table{
    user-select: none;
    display: grid;
    width: max-content;

  }
  .header-bar{
    display: contents;
  }
  .header-cell{
    width: 100%;
    min-width: 3em;
    cursor: default;
    appearance: none;
    border: none;
    position: relative;
    transition: left 400ms 0ms;
    
    &[data-dragging=true]{
      transition-duration: 0ms;
      z-index: 50;
      background-color: var(--c-bg-3);
    }
  }
  .label{
      display: inline-block;
      width: 100%;
      height: 100%;
      position: relative;
      [data-dragging=false]>&{
        border-inline-end: thin solid;
        border-color: inherit;
      }
    }
  .label,.content-cell{
    
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .drag-area{
    position: absolute;
    float: inline-end;
    top: 0;
    right: -0.5em;
    height: 100%;
    width: 1.0em;
    /* right: 0.5em; */
    z-index: 10;
    [data-debug=true] &{
      background-color: rgba(255, 0, 0, 0.541) ;
    } 

    &:hover{
      cursor: col-resize;
    }
    .header-cell[data-dragging=true]>&{
      z-index: 50;
    }

  }

</style>