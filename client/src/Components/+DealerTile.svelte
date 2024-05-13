<script>
    export let imgSrc;
    export let name,email,location,count,dealerId;
    import {goto} from "$app/navigation"
    import {Button} from "flowbite-svelte"
  import { ServerBase } from "../routes/endpoints";
    const HandleGoto=()=>{
        sessionStorage.setItem("DealerId",dealerId)
        goto("/ViewDealer")
    }
    let imgSource=ServerBase+"/"+imgSrc.replaceAll("\\","/")
</script>

<div 
  class="md:w-[30rem]  cursor-default scale-90 rounded-lg hover:bg-white/20 bg-slate-900/50 p-2 flex flex-col items-center transition-all duration-300  pt-[3rem] group backdrop-blur-lg w-full "
>
  <img alt="car"
    class=" w-3/4 rounded-xl {imgSrc?"invert-0":"invert"} group-hover:drop-shadow-[0_0_0.4rem_#000] transition-all duration-300 aspect-square "
    src={imgSrc?imgSource:"./carlog.png"}
  />
  <div class="w-full flex justify-between items-center p-2 px-2 gap-4">
    <div class="flex flex-col w-[60%] flex-wrap my-4">
      <span class="font-Anton text-white  text-4xl ">{name||"No Name"}</span>
      <p class="font-Barlow break-words text-wrap text-xl text-gray-200"
        >{email||"No email"}</p
      >
      <span class="text-sm text-gray-100">{location=="undefined"?"location not specified":location}</span>
    </div>
    <div class="flex flex-col  justify-center items-center">
        <span class="text-gray-300 text-3xl rounded-lg  w-fit ">{count}</span>
        <span class="text-xl text-nowrap text-orange-300">Total selling</span>
    </div>
  </div>
  
  <div class="w-full flex px-4 mt-4 mb-8 justify-end">
    <Button color="dark" on:click={HandleGoto}>View</Button>
  </div>
</div>

