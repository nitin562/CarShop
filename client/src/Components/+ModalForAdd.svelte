<script>
  export let open = false;
  export let changeOpen;
  export let FetchCars;

  import {
    Button,
    Modal,
    Input,
    Label,
    Textarea,
    Helper,
    Spinner,
  } from "flowbite-svelte";
  import { links } from "../routes/endpoints";
  import { ErrorManage } from "../UtilFunc/ErrorManagement.js";
  let imgSrc = "/carAdd.jpeg";
  let imgData = null;
  let carName = "";
  let carType = "";
  let carModel = "";
  let desc = "";
  let errors = {};
  let loading=false
  const HandleImageClick = () => {
    document.querySelector("#CarFile").click();
  };
  const HandleChange = (e) => {
    const file = e.target.files[0];
    imgData = file;
    let reader = new FileReader();
    reader.onload = (e) => {
      imgSrc = e.target.result;
    };
    reader.readAsDataURL(file);
  };
  const HandleFetch = async () => {
    loading=true
    errors={}
    if(desc===""){
      errors.info="Description must be there"
      loading=false
      return
    }
    const url = links.AddCar;
    const formdt = new FormData();

    formdt.append("name", carName);
    formdt.append("car", imgData);
    formdt.append("type", carType);
    formdt.append("model", carModel);
    formdt.append("info", JSON.stringify({ desc }));
    const options = {
      method: "POST",
      headers: {
        token: sessionStorage.getItem("token"),
        user_type: "dealers",
      },
      body: formdt,
    };
    const response = await fetch(url, options);
    const result = await response.json();
    //(result);
    if (result.success === 1) {
      await FetchCars()
      changeOpen()
    } else {
      errors = ErrorManage(result, ["name", "type", "model", "car", "info"]);
    }
    loading=false
  };
</script>

<Modal
  title="Add new car to inventory"
  color="dark"
  class="bg-slate-900"
  bind:open

>
  <div class="flex flex-col gap-6 p-2">
    <div class="w-full flex gap-8">
      <div>
        <button
          class="w-[10rem] h-[10rem] bg-no-repeat bg-center bg-contain cursor-pointer"
          style="background-image:url('{imgSrc}')"
          on:click={HandleImageClick}
        ></button>
        {#if errors.file}
          <Helper color="red">
            <span class="text-md text-red-600">{errors.file}</span>
          </Helper>
        {/if}
      </div>
      <input
        type="file"
        id="CarFile"
        class="hidden"
        accept="image/*"
        on:change={HandleChange}
      />
      <div class="flex-1 flex flex-col gap-4">
        <div>
          <Input
            type="text"
            placeholder="Enter Name of car i.e Honda"
            class="bg-slate-800 h-fit text-white font-Quicksand"
            bind:value={carName}
          />
          {#if errors.name}
            <Helper color="red">
              <span class="text-md text-red-500">{errors.name}</span>
            </Helper>
          {/if}
        </div>
        <div>
          <Input
            type="text"
            placeholder="Enter Model of car i.e A4S2"
            class="bg-slate-800 h-fit text-white font-Quicksand"
            bind:value={carModel}
          />
          {#if errors.model}
            <Helper color="red">
              <span class="text-md text-red-500">{errors.model}</span>
            </Helper>
          {/if}
        </div>
        <div>
          <Input
            type="text"
            placeholder="Enter type of car i.e Sedian"
            class="bg-slate-800 h-fit text-white font-Quicksand"
            bind:value={carType}
          />
          {#if errors.type}
            <Helper color="red">
              <span class="text-md text-red-500">{errors.type}</span>
            </Helper>
          {/if}
        </div>
      </div>
    </div>
    <div class="w-full border-t-[1px] border-t-white/40 py-1">
      <Label
        for="textarea-id"
        class="mb-2 font-Oxygen text-md text-emerald-400 font-bold"
        >Describe your car</Label
      >
      <Textarea
        id="textarea-id"
        placeholder="Your Description"
        rows="4"
        name="message"
        class="font-Quicksand text-white text-md bg-slate-800 resize-none  border-0"
        bind:value={desc}
      />
      {#if errors.info}
        <Helper color="red">
          <span class="text-md text-red-500">{errors.info}</span>
        </Helper>
      {/if}
    </div>
  </div>
  <svelte:fragment slot="footer">
    <Button on:click={HandleFetch} class="flex gap-2">
      {#if loading}
        <Spinner size={4}/>
      {/if}
       Add</Button>
    <Button color="alternative" on:click={changeOpen()}>Cancel</Button>
  </svelte:fragment>
</Modal>
