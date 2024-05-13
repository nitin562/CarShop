<script>
  import { Alert, Button, Spinner } from "flowbite-svelte";
  import { links } from "../routes/endpoints";
  import { ErrorManage } from "../UtilFunc/ErrorManagement";
    import {goto} from "$app/navigation"
  export let dealerName;
  export let dealerLocation;
  export let dealerImg;
  export let dealerId;
  let loading = false;
  let buy = false;
  let errors = {};
  const HandleBuy = async () => {
    if (buy) {
      errors.server = "Already Bought by you";
      return;
    }
    loading = true;
    errors = {};
    const url =
      links.Buy +
      `/${sessionStorage.getItem("CarId")}/${dealerId}/${sessionStorage.getItem("DealId")}`;
    const options = {
      headers: {
        token: sessionStorage.getItem("token"),
      },
    };
    const response = await fetch(url, options);
    const result = await response.json();
    //(result);
    if (result.success) {
      buy = true;
      errors.success = "Congratulations, You have owned a car. Redirecting to Home Page";
      {
        setTimeout(() => {
          errors.success = undefined;
        }, 2500);
        setTimeout(()=>{
            goto("/user")
          },3000)
      }
    } else {
      errors = ErrorManage(result, []);
      if (errors.server) {
        {
          setTimeout(() => {
            errors.server = undefined;
          }, 2500);
          
        }
      }
    }
    loading = false;
  };
</script>

{#if errors.server || errors.success}
  <Alert
    color={errors.server ? "red" : "green"}
    class="w-full absolute top-0 left-0"
    >{errors.server ? errors.server : errors.success}</Alert
  >
{/if}
<div class="w-full p-4">
  <div class="flex flex-col gap-4">
    <div
      class="w-full flex flex-col gap-2 bg-stone-800/40 p-2 text-gray-700 rounded-lg"
    >
      <div class="text-2xl font-Comfortaa font-bold px-1">
        <i class="fa-solid fa-user-check mr-4 text-white"></i>Know your Dealer
      </div>
      <!-- dealer information -->
    </div>
    <div
      class="flex w-full border-[1px] backdrop-blur-lg border-slate-700 rounded-lg bg-black/25 h-[6rem] p-2 justify-between items-center hover:brightness-150 cursor-pointer"
    >
      <img
        src={dealerImg || "/carlog.jpg"}
        alt="car"
        class="h-full aspect-square rounded-full {dealerImg
          ? 'invert-0'
          : 'invert'}"
      />
      <div class="flex flex-col items-center">
        <span
          class="text-3xl font-Quicksand text-rose-500 bg-slate-900/60 p-1 px-3 font-bold rounded-lg"
          >{dealerName}</span
        >
        <span class="text-2xl font-Quicksand text-green-200"
          >{dealerLocation || "No Location specified"}</span
        >
      </div>
    </div>
    <div class="w-full p-2">
      <Button on:click={HandleBuy} class="float-right text-lg bg-rose-500">
        {#if loading}
          <Spinner size={4} class="mr-4" />
        {/if}{buy ? "Bought" : "Buy"}</Button
      >
    </div>
  </div>
</div>
