<script>
  import { Search, Button } from "flowbite-svelte";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { DealerCarList } from "../store/store.js";
  import { links } from "../routes/endpoints";
  import ModalForAdd from "./+ModalForAdd.svelte";
  let nameChar = "Dealer";
  let openModal = false;
  const changeOpen = () => {
    openModal = !openModal;
  };
  let toggle = false;
  const Logout = () => {
    sessionStorage.clear()

    goto("/");
  };
  const FetchCars = async () => {
    const url = links.CarsOfDealers;
    const options = {
      headers: {
        token: sessionStorage.getItem("token"),
        user_type: "dealers",
      },
    };
    const response = await fetch(url, options);
    const result = await response.json();
    //(result);
    if (result.success === 1) {
      if(result.data.records.length===0){
        return
      }
      DealerCarList.set(result.data.records[0].DealerCars)
    }
  };
  onMount(() => {
    FetchCars();
    nameChar = sessionStorage.getItem("name") || "Dealer";
  });
</script>

<div
  class="w-full h-[4rem] bg-black/30 gap-8 flex justify-between px-4 items-center p-2 relative"
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
    <button
      on:click={() => {
        openModal = true;
      }}
      class="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-black transition-all duration-300 cursor-pointer"
    >
      <i class="fa-solid fa-plus text-red-700 text-xl"></i>
    </button>
    <div
      class="w-10 h-10 rounded-full bg-sky-800 flex items-center justify-center text-2xl text-white"
    >
      {nameChar[0].toUpperCase()}
    </div>
    <Button
      class="text-xl h-[80%] font-Arsenal bg-red-500 hover:bg-red-700 transition-all duration-300"
      on:click={Logout}>Log out</Button
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
          goto("/ViewDealer")
        }}
      >
        <i class="fa-solid fa-car"></i>
        <p class="md:text-lg">Your Available Deals</p>
      </button>
      <button
        class="flex w-full gap-4 hover:bg-purple-600/20 transition-all duration-300 cursor-pointer hover:text-white p-2 items-center bg-white"
        on:click={() => {
          toggle = false;
          goto("/TrackCars")
        }}
      >
        <i class="fa-solid fa-user"></i>
        <p class="md:text-lg">Sold Cars</p>
      </button>
    </div>
  </div>
  <!-- Modal for add -->
  <ModalForAdd open={openModal} {changeOpen} {FetchCars} />
</div>
