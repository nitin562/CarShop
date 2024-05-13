<script>
  import { onMount } from "svelte";
  import { Img } from "flowbite-svelte";
  import { goto } from "$app/navigation";
  import Edit from "../../Components/+Edit.svelte"
  import { ServerBase, links } from "../endpoints.js";
  import AddDeal from "../../Components/+AddDeal.svelte";
  import BuyCar from "../../Components/+BuyCar.svelte";
  import { get } from "svelte/store";
  let carname,
    cartype,
    carmodel,
    desc,
    pricing,
    warranty,
    dealername,
    dealerlocation,
    soldCars,
    carImg,
    DealerId,
    dealerImg;
  let user_type="client"
  const fetchCarDetail = async () => {
    let url = links.ViewCar + "/" + sessionStorage.getItem("CarId");
    if (sessionStorage.getItem("DealId")) {
      url = url + "?DealId=" + sessionStorage.getItem("DealId");
    }
    const options = {
      headers: {
        token: sessionStorage.getItem("token"),
      },
    };
    const response = await fetch(url, options);
    const result = await response.json();
    if (result.success === 1) {
      //(result.data);
      let { CarDetails, dealInfo } = result.data;
      carname = CarDetails.name;
      (carmodel = CarDetails.model),
        (cartype = CarDetails.type),
        (carImg = CarDetails.car_info.path);
      desc = CarDetails.car_info.desc;
      carImg = ServerBase + "/" + carImg.replaceAll("\\", "/");
      if (dealInfo) {
        let { Deal, Dealer } = dealInfo;
        pricing = Deal.deal_info.pricing;
        warranty = Deal.deal_info.warranty;
        dealerImg = Dealer.dealership_info?.path;
        dealerlocation = Dealer.dealership_location;
        dealername = Dealer.dealership_name;
        soldCars = Dealer.sold_vehicles.length;
        DealerId = Dealer._id;
        if (dealerImg) {
          dealerImg = ServerBase + "/" + dealerImg.replaceAll("\\", "/");
        }
        
      }
    }
  };
  onMount(() => {
    user_type=sessionStorage.getItem("type")
    fetchCarDetail();
  });
</script>

<div class="flex w-screen justify-center z-10 h-screen BgBack">
  <div class="w-full h-full flex flex-col backdrop-blur-md">
    <!-- Details -->
    <div class="flex-1 flex flex-col md:flex-row overflow-y-auto">
      <!-- left side for image -->
      <div
        class="w-full md:w-1/2 h-full p-2 flex items-center justify-center flex-col"
      >
        <Img
          src={carImg}
          alt="My gallery"
          class="rounded-lg my-1 transition-all duration-300 cursor-pointer  h-[85%] "
        />
        <span
          class="text-xl text-white rounded-lg p-2 bg-slate-800 font-Quicksand"
          >{carname}</span
        >
      </div>
      <!-- RightSide -->
      <div class="flex-1 p-2">
        <nav class="w-full flex h-[4rem] items-center px-4">
          <button
            on:click={() => {
              sessionStorage.removeItem("DealId")
              sessionStorage.removeItem("CardId")

              if(sessionStorage.getItem("type")==="client"){
                goto("/user")
                return
              }
              goto("/dealer");
            }}
            class="flex items-center hover:scale-110 transition-all duration-200 cursor-pointer gap-4 rounded-lg"
          >
            <i
              class="fa-solid fa-arrow-left text-xl flex justify-center items-center rounded-full text-blue-600 cursor-pointer"
            ></i>
            <span class="text-blue-500 text-xl font-bold font-Quicksand"
              >Back to page</span
            >
          </button>
        </nav>
        <!-- information -->
        <div
          class="w-full flex justify-between border-[1px] rounded-lg border-black p-4"
        >
          <div class=" flex flex-col">
            <p class="font-Anton text-3xl text-slate-600">
              <i class="fa-solid fa-car mr-4" />{carname}
            </p>
            <div class="mt-4 flex gap-4">
              <span class="p-1 bg-blue-600 text-white rounded-lg"
                >{carmodel}</span
              >
              <span class="p-1 bg-blue-600 text-white rounded-lg"
                >{cartype}</span
              >
            </div>
          </div>
          <!-- price -->
          {#if pricing}
            <div class="flex-[1 0 0] flex flex-col items-center">
              <span
                class="text-2xl font-[impact] bg-red-600 text-white p-1 rounded-lg"
                >Rs. 2000000</span
              >
              <span class="text-xl font-Barlow text-gray-600 font-bold"
                >4 years</span
              >
            </div>
          {/if}
        </div>
        <div class="flex p-4 flex-col gap-2">
          <div
            class="text-2xl flex items-center gap-4 font-Palanquin font-bold text-gray-600"
          >
            More Information <div class="flex-1 border-[1px] border-black/40" />
          </div>
          
            <ol class="list-disc p-4 w-[80%]">
              <li class="text-xl text-gray-500 font-PT_Sans_Narrow">
                Model name - {carmodel}
              </li>
              <li class="text-xl text-gray-500 font-PT_Sans_Narrow">
                Model type - {cartype}
              </li>
            </ol>
            
        
          <p
            class="w-full border-2 min-h-16 text-lg font-Quicksand bg-slate-900 text-white p-1 px-2 rounded-xl"
          >
            {desc}
          </p>
        </div>
        {#if !DealerId}
          <AddDeal />
        {:else if user_type==="dealer" && DealerId}
          <Edit name={carname} imageSrc={carImg} model={carmodel} type={cartype} pricing={pricing} description={desc} warranty={warranty}/>
        {:else}
          <BuyCar dealerImg={dealerImg} dealerLocation={dealerlocation} dealerName={dealername} dealerId={DealerId} />

        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .BgBack:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 100vw;
    height: 100vh;

    background: url("/bg4.jpg") no-repeat center center/cover;
  }
</style>
