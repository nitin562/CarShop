<script>
  import { goto } from "$app/navigation";

  import Options from "../../Components/+Options.svelte";
  import Button from "../../Components/+button.svelte";
  import InputField from "../../Components/+inputField.svelte";

  import { ErrorManage } from "../../UtilFunc/ErrorManagement";
  import { links } from "../endpoints";
  let loading=false
  let imgSrc = "./addUser.jpg";
  let imgData = null;
  let userType = "client";
  let username = "";
  let password = "";
  let location = "Enter state";
  let email = "";
  let errors = {};
  const HandleImage = () => {
    document.getElementById("File").click();
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
  const HandleFetch = async (e) => {
    e.preventDefault();
    loading=true
    errors = {};
    const data = new FormData();
    let url = links.SignupUser;
    if (userType === "dealer") {
      data.append("name", username);
      data.append("info", JSON.stringify({}));
      url = links.SignupDealer;
    } else {
      if (username.length < 3) {
        errors = { name: "Name must be atleast 3 characters" };
        return;
      }
      data.append("info", JSON.stringify({ name: username }));
    }
    data.append("email", email);
    data.append("password", password);
    if (location === "Enter state") {
      errors = { location: "true" };
      return;
    }
    data.append("location", location);
    if (imgData) {
      data.append("profile", imgData);
    }

    const options = {
      method: "POST",
      body: data,
    };
    const response = await fetch(url, options);
    const result = await response.json();
    //(result);
    if (result.success === 1) {
      sessionStorage.setItem("token", result.data.Token);
      sessionStorage.setItem("name", result.data.name);
      sessionStorage.setItem("type",userType==="client"?"client":"dealer")

      loading=false
      if(userType==="client"){
        goto("/user")
      }
      else{
        goto("/dealer")
      }
    } else {
      //(result);
      errors = ErrorManage(result, ["name", "email", "password", "location"]);
    }
    loading=false;
  };
</script>

<svelte:head>
  <title>Register</title>
</svelte:head>

<div
  class="w-screen h-screen md:p-2 flex justify-center items-center bg-blue-700/50 bgBack z-10"
>
  <div
    class="w-full md:w-3/4 h-full md:h-[95%] flex flex-col backdrop-blur-lg p-2 items-center gap-y-4 overflow-y-auto"
  >
    <button on:click={HandleImage}
      ><img
        src={imgSrc}
        alt="logo"
        class="w-[10rem] my-4 aspect-square rounded-full cursor-pointer hover:drop-shadow-[0_0_0.5rem_#fff]"
      /></button
    >
    <input
      type="file"
      id="File"
      class="absolute hidden"
      on:change={HandleChange}
    />

    <InputField
      name="name"
      usertype="text"
      on:change={(e) => {
        username = e.detail.value;
      }}
      placeholder="Enter Name"
      icon="fa-solid fa-user"
      width={60}
      errors={errors.name}
    />

    <InputField
      name="email"
      usertype="email"
      on:change={(e) => {
        email = e.detail.value;
      }}
      placeholder="Enter Email"
      icon="fa-solid fa-envelope"
      width={60}
      errors={errors.email}
    />

    <InputField
      name="password"
      usertype="password"
      on:change={(e) => {
        password = e.detail.value;
      }}
      placeholder="Enter Password"
      icon="fa-solid fa-key"
      width={60}
      errors={errors.password}
    />
    <div class="w-[90%] md:w-[60%] flex justify-between flex-wrap gap-4">
      <Options loc={location} changeloc={(val)=>{location=val;}}
        errors={errors.location}
      />
      <div class="flex gap-x-4 items-center">
        <label>
          <input
            type="checkbox"
            name="userType"
            value="client"
            class="scale-150"
            checked={userType === "client"}
            on:change={() => {
              userType = "client";
            }}
          />
          <span
            class="text-white group-checked:text-orange-400 font-AR_One_Sans"
            >Client</span
          >
        </label>

        <label>
          <input
            type="checkbox"
            name="userType"
            value="dealer"
            class="scale-150"
            checked={userType === "dealer"}
            on:change={() => {
              userType = "dealer";
            }}
          />
          <span
            class="text-white group-checked:text-orange-400 font-AR_One_Sans"
            >Dealer</span
          >
        </label>
      </div>
    </div>
    <div class="w-[90%] md:w-[60%] flex justify-between items-center mt-12">
      <button
        on:click={() => {
          goto("/");
        }}
        class="text-white hover:text-red-500 p-2 hover:bg-white rounded-full text-xl cursor-pointer transition-all duration-300 justify-items-start bottom-0 left-3/4"
        >Login?</button
      >
      <div>
        
        <Button title="Register" HandleClick={HandleFetch} load={loading} />
      </div>
    </div>
  </div>
</div>

<style>
  .bgBack:before {
    content: "";
    width: 100vw;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    background: url("/Bg2.webp") no-repeat center center/cover;
    z-index: -1;
  }
</style>
