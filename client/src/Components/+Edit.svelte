<script>
  import {
    Button,
    Modal,
    Label,
    Input,
    Textarea,
    Helper,
    Spinner,
    Alert,
  } from "flowbite-svelte";
  import { links } from "../routes/endpoints";
  import { ErrorManage } from "../UtilFunc/ErrorManagement";
  export let name, model, type, description, imageSrc, pricing, warranty;
  let open;
  let loading = false;
  let errors = {};
  const HandleImageClick = () => {
    document.querySelector("#CarFile").click();
  };
  let imgData = null;
  const HandleChange = (e) => {
    const file = e.target.files[0];
    imgData = file;
    let reader = new FileReader();
    reader.onload = (e) => {
      imageSrc = e.target.result;
    };
    reader.readAsDataURL(file);
  };
  const HandleFetch = async () => {
    loading = true;
    errors = {};
    if (description === "") {
      errors.info = "Description must be there";
      loading = false;
      return;
    }
    const url =
      links.Edit +
      `/${sessionStorage.getItem("CarId")}?DealId=${sessionStorage.getItem("DealId")}`;
    const formdt = new FormData();
    formdt.append("name", name);
    formdt.append("model", model);
    formdt.append("type", type);
    formdt.append("profile", imgData);
    formdt.append("pricing", pricing);
    formdt.append("warranty", warranty);
    formdt.append("info", JSON.stringify({ desc: description }));
    const options = {
      method: "PATCH",
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
      loading = false;
      open = false;
      errors.success = "Updated";
      {setTimeout(()=>{
        errors.success=undefined
    },2500)}
    } else {
      loading = false;
      errors = ErrorManage(result, [
        "name",
        "model",
        "profile",
        "pricing",
        "info",
        "warranty",
        "type",
      ]);
      if (errors.server) {
        {
          setTimeout(() => {
            errors.server = undefined;
          }, 2500);
        }
      }
    }
  };
</script>

{#if errors.server || errors.success}
  <Alert
    color={errors.server ? "red" : "green"}
    class="w-full absolute top-0 left-0"
    >{errors.server ? errors.server : errors.success}</Alert
  >
{/if}
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
          style="background-image:url('{imageSrc}')"
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
            bind:value={name}
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
            bind:value={model}
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
            bind:value={type}
          />
          {#if errors.type}
            <Helper color="red">
              <span class="text-md text-red-500">{errors.type}</span>
            </Helper>
          {/if}
        </div>
        <div>
          <Input
            type="text"
            placeholder="Enter pricing of car"
            class="bg-slate-800 h-fit text-white font-Quicksand"
            bind:value={pricing}
          />
          {#if errors.pricing}
            <Helper color="red">
              <span class="text-md text-red-500">{errors.pricing}</span>
            </Helper>
          {/if}
        </div>
        <div>
          <Input
            type="text"
            placeholder="Enter Warranty of car in years"
            class="bg-slate-800 h-fit text-white font-Quicksand"
            bind:value={warranty}
          />
          {#if errors.warranty}
            <Helper color="red">
              <span class="text-md text-red-500">{errors.warranty}</span>
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
        bind:value={description}
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
        <Spinner size={4} />
      {/if}
      Update</Button
    >
    <Button
      color="alternative"
      on:click={() => {
        open = false;
      }}>Cancel</Button
    >
  </svelte:fragment>
</Modal>
<div class="w-full flex justify-end items-center p-4">
  <Button
    on:click={() => {
      open = true;
    }}>Edit</Button
  >
</div>
