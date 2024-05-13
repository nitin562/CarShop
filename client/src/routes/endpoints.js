export const ServerBase="https://carshop-42o3.onrender.com"
export const links={
    "Login":ServerBase+"/api/auth/login",
    "SignupUser":ServerBase+"/api/auth/user",
    "SignupDealer":ServerBase+"/api/auth/dealer",
    "CarsForUser":ServerBase+"/api/vehicle/cars",
    "CarsOfDealers":ServerBase+"/api/vehicle/cars/dealership", //:id,
    "AddCar":ServerBase+"/api/vehicle/dealership/car",
    "ViewCar":ServerBase+"/api/vehicle/car",  //:id?DealId,
    "AddDeal":ServerBase+"/api/vehicle/deal", //:CarId
    "Buy":ServerBase+"/api/vehicle/buy", //:carId :DealerID :DealId
    "AllDealers":ServerBase+"/api/vehicle/Dealers",
    "AllDeals":ServerBase+"/api/vehicle/deals/dealership", //:id
    "Edit":ServerBase+"/api/vehicle/dealership/car", //:id
    "SoldCars":ServerBase+"/api/vehicle/soldVehicles",
    "OwnedCars":ServerBase+"/api/vehicle/yourVehicles",

    
}