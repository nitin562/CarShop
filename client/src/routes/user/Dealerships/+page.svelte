<script>
  import { Spinner } from "flowbite-svelte";
import { DealershipsList } from "../../../store/store.js";
  import DealerTile from "../../../Components/+DealerTile.svelte";
  import { links } from "../../endpoints.js";
  import { onMount } from "svelte";
  

  const HandleDealershipsFetch = async () => {
    const url = links.AllDealers;
    //(url)
    const options = {
      headers: {
        token: sessionStorage.getItem("token"),
      },
    };
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      //(result);
      if (result.success === 1) {
        //("s",result.data.records)
        DealershipsList.set(result.data.records);
      } else {
        errorMsg = "Database is low";
      }
    } catch (error) {
      errorMsg="Server is low"
    }
  };
  onMount(()=>{
    //("mounted")
    HandleDealershipsFetch()
  })
    //($DealershipsList)
</script>
<div class="flex-1  flex flex-wrap justify-center gap-4 p-4 overflow-y-auto">
    {#if $DealershipsList.length===0}
    <Spinner/>
    {/if}
    {#each $DealershipsList as element (element._id)}
        <DealerTile name={element['dealership_name']} location={element['dealership_location']} email={element['dealership_email']} imgSrc={element['dealership_info'].path} count={element['sold_vehicles'].length} dealerId={element._id}/>
    {/each}
</div>