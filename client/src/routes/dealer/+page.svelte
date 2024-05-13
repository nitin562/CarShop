<script>
  import { DealerCarList } from "../../store/store";
  import CarTileForUser from "../../Components/+CarTileForUser.svelte";
  import { Spinner } from "flowbite-svelte";

  //($DealerCarList);
</script>
<svelte:head>
  <title>Welcome </title>
</svelte:head>
<div class="flex-1 flex flex-wrap justify-center gap-4 p-4 overflow-y-auto">
  {#if $DealerCarList.length === 0}
    <p class="text-2xl md:text-5xl text-center my-16 text-white font-Comfortaa">
      Current there is no Cars in your inventory
    </p>
  {:else}
    {#each $DealerCarList as CarDetail}
      <CarTileForUser
        carname={CarDetail.name}
        carId={CarDetail._id}
        carModel={CarDetail.model}
        carImage={CarDetail["car_info"].path}
        description={CarDetail["car_info"].desc}
        carType={CarDetail.type}
        btnTitle="Add Deal"
      />
    {/each}
  {/if}
</div>
