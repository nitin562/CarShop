<script>
  import { Input, Helper, Button, Alert, Spinner } from "flowbite-svelte";
  import { links } from "../routes/endpoints";
  import { ErrorManage } from "../UtilFunc/ErrorManagement";
  let errors = {};
  let pricing = "",
    warranty = "";
  let added = false;
  let loading = false;
  const HandleAddDeal = async () => {
    if (added == true) {
      errors.server = "Already added";
      return;
    }
    errors = {};
    loading = true;
    //(typeof pricing, warranty);

    const url = links.AddDeal + "/" + sessionStorage.getItem("CarId");
    const options = {
      method: "POST",
      headers: {
        token: sessionStorage.getItem("token"),
        "Content-Type": "application/json",
        user_type: "dealers",
      },
      body: JSON.stringify({
        pricing: Number(pricing),
        warranty: Number(warranty),
      }),
    };
    const response = await fetch(url, options);
    const result = await response.json();
    //(result);

    if (result.success === 1) {
      added = true;
      loading = false;
    } else {
      loading = false;
      errors = ErrorManage(result, ["pricing", "warranty"]);
    }
  };
</script>

{#if errors.server}
  <Alert color="red" class="w-full absolute top-0 left-0">{errors.server}</Alert
  >
  {setTimeout(() => {
    errors.server = undefined;
  }, 2500)}
{/if}
<div class="w-full p-4 flex flex-col gap-4">
  <div class="w-full bg-stone-800/40 p-2 rounded-lg text-gray-700 ">
    <div class="text-2xl font-Comfortaa font-bold px-1">
      <i class="fa-solid fa-plus mr-4 text-white" />Add to a Deal
    </div>
  </div>
  <div class="w-full flex flex-col justify-center gap-2">
    <div class="flex gap-2 items-center bg-slate-900 px-2 rounded-lg">
      <i class="fa-solid text-white text-xl fa-indian-rupee-sign"></i>
      <Input
        bind:value={pricing}
        placeholder="Enter Price in Rs i.e 2000000"
        type="number"
        class="bg-transparent border-0 outline-0 text-white text-lg w-full"
      ></Input>
    </div>
    {#if errors.pricing}
      <Helper color="red">
        <span>{errors.pricing}</span>
      </Helper>
    {/if}
  </div>
  <div class="w-full flex flex-col justify-center gap-2">
    <div class="flex gap-2 items-center bg-slate-900 px-2 rounded-lg">
      <i class="fa-solid text-white text-xl fa-calendar-days"></i>
      <Input
        placeholder="Enter warranty years i.e 4"
        bind:value={warranty}
        type="number"
        class="bg-transparent border-0 outline-0 text-white text-lg w-full"
      ></Input>
    </div>
    {#if errors.warranty}
      <Helper color="red">
        <span>{errors.warranty}</span>
      </Helper>
    {/if}
  </div>
  <div class="w-full">
    <Button
      on:click={HandleAddDeal}
      class="flex items-center text-xl float-right"
      ><i class="fa-solid fa-{added ? 'check' : 'plus'} text-xl mr-4"></i>{added
        ? "Added"
        : "Add a Deal"}
      {#if loading}
        <Spinner class="ml-4" size={4} />
      {/if}
    </Button>
  </div>
</div>
