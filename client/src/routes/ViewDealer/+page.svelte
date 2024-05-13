<script>
  import { onMount } from "svelte";
  import { links } from "../endpoints";
  import { goto } from "$app/navigation";
  import CarTileForUser from "../../Components/+CarTileForUser.svelte";
  let data = [];
  const HandleFetchDeals = async () => {
    let url = links.AllDeals;
    if (sessionStorage.getItem("type") === "client") {
      url = url + `?id=${sessionStorage.getItem("DealerId")}`;
    }
    //(url);
    const options = {
      headers: {
        token: sessionStorage.getItem("token"),
        user_type:
          sessionStorage.getItem("type") === "dealer" ? "dealers" : "users",
      },
    };
    const response = await fetch(url, options);
    const result = await response.json();
    if (result.success === 1) {
      data = result.data.records[0];
      //(data);
    }
  };
  onMount(() => {
    HandleFetchDeals();
  });
  const HandleGoto = () => {
    if (sessionStorage.getItem("type") === "client") {
      sessionStorage.removeItem("DealerId");
      goto("/user");
    } else {
      goto("/dealer");
    }
  };
</script>

<div class="w-screen h-screen flex flex-col z-10 bg-yellow-500/20 BgBack">
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
      {#each data.cars as carDetail, index (data.deals[index]._id)}
        <CarTileForUser
          DealId={data.deals[index]._id}
          warranty={data.deals[index].deal_info.warranty}
          pricing={data.deals[index].deal_info.pricing}
          carname={carDetail.name}
          carModel={carDetail.model}
          carType={carDetail.type}
          carId={carDetail._id}
          carImage={carDetail.car_info.path}
          description={carDetail.car_info.desc}
        />
      {/each}
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
    width: 100vw;

    height: 100vh;
    background: url("/bg5.jpg") no-repeat center center/cover;
    z-index: -1;
  }
</style>
