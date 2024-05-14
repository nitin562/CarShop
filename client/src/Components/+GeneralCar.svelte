<script>
  import {Img } from "flowbite-svelte";
  import { ServerBase } from "../routes/endpoints";
  import {goto} from "$app/navigation"
    export let carSrc,carModel,carname,carType,pricing,warranty,description,name,nameSrc,loc,type,dealerId=null;
    let price=`Rs. ${pricing}`
   
    let CarSourceUrl=ServerBase+"/"+carSrc.replaceAll("\\","/")
    let nameSourceUrl="/user.png";
    if(nameSrc){
      nameSourceUrl=ServerBase+"/"+nameSrc.replaceAll("\\","/")
      
    }
    const handleClickonInfo=()=>{
      if(type==="client"){
        sessionStorage.setItem("DealerId",dealerId)
        goto("/ViewDealer")
      }
    }
</script>
<div 
  class="md:w-[30rem]  cursor-default scale-90 rounded-lg hover:bg-white/40 bg-slate-900/50 p-2 flex flex-col items-center transition-all duration-300  pt-[3rem] group backdrop-blur-lg w-full "
>
  <Img alt="car"
    class=" w-3/4 rounded-xl group-hover:drop-shadow-[0_0_0.4rem_#000] transition-all duration-300 aspect-square "
    src={CarSourceUrl}
  />
  <div class="w-full flex justify-between items-center p-2 px-4">
    <div class="flex flex-col my-4">
      <span class="font-Anton text-white text-2xl">{carname||"No Name"}</span>
      <span class="font-Barlow text-lg text-gray-200"
        >{carModel||"No Model"} {carType||"No Type"}</span
      >
    </div>
    <div class="flex flex-col">
      {#if pricing}
      <span class="text-xl px-2 text-white bg-rose-600 font-Abel rounded-xl"
      >{price}</span
    >
      {/if}
      {#if warranty}
      <span class="text-sm px-2 text-yellow-300">{warranty} years</span>
        
      {/if}
    </div>
  </div>
  <p class="break-words px-4 w-full min-h-20 bg-slate-900 py-4 rounded-xl text-emerald-300 font-Comfortaa text-sm">
    {description||"Description Empty"}
  </p>
  <button on:click={handleClickonInfo} class="w-full flex h-[8rem] hover:bg-slate-900/50 cursor-pointer p-2 px-4 mt-4 mb-8 justify-between items-center">
    <Img src={nameSourceUrl} class="h-full aspect-square rounded-xl"/>
    <div class="flex flex-col">
      <span class="text-xl text-orange-400 font-bold font-Comfortaa">{name}</span>
      <span class="text-md text-emerald-200 font-Abel">{loc}</span>

    </div>
  </button>
</div>