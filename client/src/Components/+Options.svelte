<script>
 

    let toogle=false
    const toogleUp=()=>{
        toogle= !toogle
    }
    export let loc;
    export let changeloc;
    export let errors=null
    
</script>

<button on:click={toogleUp}> <div class="relative h-8 w-[10rem] rounded-lg flex bg-white items-center p-1" style="border:0.1rem solid {errors?"red":"transparent"}" >
    <p class="bg-white text-xl font-bold font-Arsenal flex-1">{loc}</p>
    <i class="fa-solid fa-angle-down text-black"/>
    <div class="absolute top-full z-20 left-0 w-full  py-1 flex flex-col gap-y-2  {toogle?'h-fit bg-slate-500/50':'h-0 overflow-hidden'}">
        <button on:click={changeloc("Delhi")} ><p class="text-white  hover:bg-slate-800 p-1 " >Delhi</p></button>
        <button on:click={changeloc("Mumbai")}><p class="text-white hover:bg-slate-800 p-1" >Mumbai</p></button>
        <button on:click={changeloc("Kolkata")}><p class="text-white hover:bg-slate-800 p-1" >Kolkata</p></button>
    </div>
</div></button>