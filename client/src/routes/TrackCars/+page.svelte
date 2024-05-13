<script>
    import {goto} from "$app/navigation"
  import { onMount } from "svelte";
  import GeneralCar from "../../Components/+GeneralCar.svelte";
  import { links } from "../endpoints";
  import { Spinner } from "flowbite-svelte";
    const HandleGoto=()=>{
        if(sessionStorage.getItem("type")==="client"){
            goto("/user")
            return
        }
        goto("/dealer")
    }
    let data=[]
    let type="client"
    let loading=false
    const HandleFetch=async()=>{
      loading=true
        let url=sessionStorage.getItem("type")==="client"? links.OwnedCars:links.SoldCars;
        const options={
            headers:{
                token:sessionStorage.getItem("token"),
                user_type:sessionStorage.getItem("type")==="client"?"users":"dealers"
            }
        }
        const response=await fetch(url,options)
        const result=await response.json()
        if(result.success===1){
            //(result)
            data=result.data.records
            //(data)
        }
        loading=false
    }
    onMount(()=>{
        type=sessionStorage.getItem("type")
        HandleFetch()
    })
    
</script>
<svelte:head>
  <title>{type==="client"?"Your Cars":"Sold Cars"}</title>
</svelte:head>
<div class="w-screen h-screen flex flex-col z-10 bg-black/40 BgBack">
    <nav class="w-full h-16 flex items-center px-6">
      <button on:click={HandleGoto}
        class="flex gap-2 items-center w-fit text-emerald-400 hover:scale-110 transition-all duration-300 cursor-pointer text-xl"
      >
        <i class="fa-solid fa-arrow-left"></i>
        <span class="font-Quicksand">Back to the home</span>
      </button>
    </nav>
    <div class="flex-1 flex flex-wrap justify-center gap-4 p-4 overflow-y-auto">
        {#if data && data.length !== 0}
          {#each data as carDetail, index (index)}
            {#if type==="client"}
                <GeneralCar dealerId={carDetail.Dealership[0]._id} type="client" carname={carDetail.car_entry[0].name} carModel={carDetail.car_entry[0].model} carType={carDetail.car_entry[0].type} description={carDetail.car_entry[0].car_info.desc} carSrc={carDetail.car_entry[0].car_info.path} nameSrc={carDetail.Dealership[0].dealership_info.path} pricing={carDetail.sold_entry.vehicle_info.pricing} warranty={carDetail.sold_entry.vehicle_info.warranty} name={carDetail.Dealership[0].dealership_name} loc={carDetail.Dealership[0].dealership_location} />
            {:else}
                <GeneralCar type="dealer" carname={carDetail.car_entry[0].name} carModel={carDetail.car_entry[0].model} carType={carDetail.car_entry[0].type} description={carDetail.car_entry[0].car_info.desc} carSrc={carDetail.car_entry[0].car_info.path}  name={carDetail.userInfo[0].user_info.name} nameSrc={carDetail.userInfo[0].user_info.path} pricing={carDetail.sold_entry.vehicle_info.pricing} warranty={carDetail.sold_entry.vehicle_info.warranty} loc={carDetail.userInfo[0].user_location} />

            {/if}

          {/each}
          {:else if loading}
            <Spinner/>
          {:else}
            <p class="text-4xl text-white font-Barlow">Currently there is no deals</p>
        {/if}
      </div>
</div>
<style>
    .BgBack:before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
      width: 100vw;
      height: 100vh;
  
      background: url("./bg4.jpg") no-repeat center center/cover;
    }
  </style>
  