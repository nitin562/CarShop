<script>
  import { Button, Search, Alert } from "flowbite-svelte";
  import { links } from "../routes/endpoints";
  import { onMount } from "svelte";

  import { CarList } from "../store/store";
  import { goto } from "$app/navigation";

  let errorMsg = null;
  let nameChar = "User";

  let toggle = false;
  const FetchCarsForUsers = async () => {
    errorMsg = null;
    const url = links.CarsForUser;
    const options = {
      headers: {
        token: sessionStorage.getItem("token"),
      },
    };
    try {
      const result = await fetch(url, options);
      const response = await result.json();
      if (response.success === 1) {
        //(response.data);
        CarList.set(response.data.cars);
        return;
      } else {
        errorMsg = "Server is low";
      }
    } catch (error) {
      //(error);
      errorMsg = "Server Side or Internet Connectivity issue, please try again";
    } finally {
      setTimeout(() => {
        errorMsg = null;
      }, 2500);
    }
  };
  
  onMount(() => {
    nameChar = sessionStorage.getItem("name");
    
      FetchCarsForUsers();


  });
  const HandleClickOnDealerships = async () => {
    toggle = false;
    goto("/user/Dealerships");
  };
  const logout = () => {
    sessionStorage.clear()

    goto("/");
  };
</script>

{#if errorMsg !== null}
  <Alert class="absolute z-30 top-0 left-0 w-full" color="red">{errorMsg}</Alert
  >
{/if}
<div
  class="w-full h-[4rem] bg-black/30 gap-8 px-4 flex justify-between items-center p-2 relative"
>
  <button
    class="flex flex-col gap-1 hover:scale-105 cursor-pointer transition-all duration-300 rounded-full bg-black w-10 h-10 p-1 items-center justify-center z-20"
    style="transform: rotate({toggle === true
      ? '90deg'
      : '0deg'}); background:{toggle === true ? '#fff' : '#000'};"
    on:click={() => {
      toggle = !toggle;
    }}
  >
    <div
      class="w-3/4 h-[1px] bg-white transition-all duration-300"
      style="background:{toggle === true ? '#000' : '#fff'}"
    ></div>
    <div
      class="w-3/4 h-[1px] bg-white transition-all duration-300"
      style="background:{toggle === true ? '#000' : '#fff'}"
    ></div>
    <div
      class="w-3/4 h-[1px] bg-white transition-all duration-300"
      style="background:{toggle === true ? '#000' : '#fff'}"
    ></div>
  </button>
  
  <div class="flex gap-4 h-full items-center">
    <div
      class="w-10 h-10 rounded-full bg-sky-800 flex items-center justify-center text-2xl text-white"
    >
      {nameChar[0].toUpperCase()}
    </div>
    <Button
      on:click={logout}
      class="text-xl h-[80%] font-Arsenal bg-red-500 hover:bg-red-700 transition-all duration-300"
      >Log out</Button
    >
  </div>
  <!-- sidebar -->
  <div
    class="absolute top-0 z-10 bg-black/50 backdrop-blur-2xl left-0 w-full md:w-[25rem] h-screen pt-16 transition-all duration-500"
    style="left:{toggle === true ? '0' : '-100%'}"
  >
    <div class="w-full border-t-[1px] pt-5">
      <button
        class="flex w-full gap-4 p-2 items-center hover:bg-purple-600/20 transition-all duration-300 cursor-pointer hover:text-white bg-white"
        on:click={() => {
          toggle = false;
          sessionStorage.removeItem("page")
          FetchCarsForUsers()
          goto("/user")
        }}
      >
        <i class="fa-solid fa-home"></i>
        <p class="md:text-lg">Home</p>
      </button>
      <button
        class="flex w-full gap-4 p-2 items-center hover:bg-purple-600/20 transition-all duration-300 cursor-pointer hover:text-white bg-white"
        on:click={() => {
          toggle = false;
          goto("/TrackCars")
        }}
      >
        <i class="fa-solid fa-car"></i>
        <p class="md:text-lg">Your Owned Cars</p>
      </button>
      <button
        class="flex w-full gap-4 hover:bg-purple-600/20 transition-all duration-300 cursor-pointer hover:text-white p-2 items-center bg-white"
        on:click={HandleClickOnDealerships}
      >
        <i class="fa-solid fa-user"></i>
        <p class="md:text-lg">All Dealers</p>
      </button>
    </div>
  </div>
</div>
