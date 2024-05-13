<script>
  import { Button, Img } from "flowbite-svelte";
  import { ServerBase } from "../routes/endpoints.js";
  import {goto} from "$app/navigation"
  export let carImage;
  let carSrc;
  if (carImage) {
    carImage = carImage.replaceAll("\\", "/");
    carSrc = ServerBase + "/" + carImage;
  } else {
    carSrc = "./BG1.webp";
  }
  //(carSrc)
  export let DealId=null;
  export let carname;
  export let carModel 
  export let carId ;
  export let carType ;
  export let warranty ;
  export let description="";
  export let btnTitle;
  if(description.length>200){
    description = description.slice(0, 200) + "...";

  }
  export let pricing;
 let price = `Rs. ${pricing}`;
 const HandleClickOnTile=()=>{
  sessionStorage.setItem("CarId",carId)
  if(DealId){
    sessionStorage.setItem("DealId",DealId)
  }
  goto("/viewCar")

 }
</script>

<div 
  class="md:w-[30rem]  cursor-default scale-90 rounded-lg hover:bg-white/40 bg-slate-900/50 p-2 flex flex-col items-center transition-all duration-300  pt-[3rem] group backdrop-blur-lg w-full "
>
  <Img alt="car"
    class=" w-3/4 rounded-xl group-hover:drop-shadow-[0_0_0.4rem_#000] transition-all duration-300 aspect-square "
    src={carSrc}
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
  <div class="w-full flex px-4 mt-4 mb-8 justify-end">
    <Button color="dark" on:click={HandleClickOnTile}>{btnTitle||"View"}</Button>
  </div>
</div>


