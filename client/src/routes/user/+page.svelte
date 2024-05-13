<script>
  import { Spinner } from "flowbite-svelte";
  import CarTileForUser from "../../Components/+CarTileForUser.svelte";
  import { CarList } from "../../store/store.js";
  //($CarList);
</script>

<svelte:head>
  <title>Welcome</title>
</svelte:head>
<div class="flex-1 flex flex-wrap justify-center gap-4 p-4 overflow-y-auto">
  {#if $CarList.length === 0}
    <Spinner />
  {/if}
  {#each $CarList as carInfo, index (index)}
    <CarTileForUser
      carname={carInfo["car_detail"][0].name}
      carModel={carInfo["car_detail"][0].model}
      DealId={carInfo._id}
      carId={carInfo["car_detail"][0]._id}
      carType={carInfo["car_detail"][0].type}
      warranty={carInfo["deal_info"].warranty}
      description={carInfo["car_detail"][0].car_info?.desc}
      pricing={carInfo["deal_info"].pricing}
      carImage={carInfo["car_detail"][0]["car_info"].path}
    />
  {/each}
</div>
<!-- let carname = carInfo["car_detail"][0].name || "";
  let carModel = carInfo["car_detail"][0].model || "";
  let carId = carInfo["car_detail"][0]._id || "";
  let carType = carInfo["car_detail"][0].type || "";
  let warranty = carInfo["deal_info"].warranty;
  let description =
    carInfo["car_detail"][0]?.desc -->
