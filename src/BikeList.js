import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutBtn from "./Components/LogoutBtn";
import "./App.css";

const BikeList = () => {
 const { isAuthenticated } = useAuth0();
 const [bikes, setBikes] = useState([]);
 const [filteredBikes, setFilteredBikes] = useState([]);
 const [minPrice, setMinPrice] = useState("");
 const [maxPrice, setMaxPrice] = useState("");
 const [selectedYear, setSelectedYear] = useState("");
 const [selectedMake, setSelectedMake] = useState("");
 const [sortBy, setSortBy] = useState(""); // Добавляем состояние для сортировки
 const [sortDirection, setSortDirection] = useState("asc"); // Направление сортировки
 const [editPriceBike, setEditPriceBike] = useState(null);

 // Загружаем данные о мотоциклах с сервера
 useEffect(() => {
  fetch("https://bike-shop-backend-dhvt.onrender.com/api/bikes")
   .then((response) => response.json())
   .then((data) => {
    console.log(data);
    setBikes(data);
    setFilteredBikes(data); // Начально показываем все мотоциклы
   })
   .catch((error) => console.error("Error fetching bikes:", error));
 }, []);

 // Функция для фильтрации мотоциклов
 const filterBikes = () => {
  let filtered = bikes;

  // Фильтрация по году
  if (selectedYear) {
   filtered = filtered.filter((bike) => bike.year === parseInt(selectedYear));
  }

  // Фильтрация по бренду
  if (selectedMake) {
   filtered = filtered.filter((bike) => bike.make === selectedMake);
  }

  // Фильтрация по цене
  if (minPrice) {
   filtered = filtered.filter((bike) => bike.price >= parseFloat(minPrice));
  }
  if (maxPrice) {
   filtered = filtered.filter((bike) => bike.price <= parseFloat(maxPrice));
  }

  // Сортировка по выбранному критерию
  if (sortBy) {
   filtered = filtered.sort((a, b) => {
    if (sortBy === "price") {
     return sortDirection === "asc" ? a.price - b.price : b.price - a.price;
    }
    if (sortBy === "year") {
     return sortDirection === "asc" ? a.year - b.year : b.year - a.year;
    }
    if (sortBy === "make") {
     return sortDirection === "asc"
      ? a.make.localeCompare(b.make)
      : b.make.localeCompare(a.make);
    }
    return 0;
   });
  }

  setFilteredBikes(filtered);
 };

 // Функция для изменения критериев сортировки
 const handleSortChange = (e) => {
  const newSortBy = e.target.value;
  const newSortDirection =
   sortBy === newSortBy && sortDirection === "asc" ? "desc" : "asc";
  setSortBy(newSortBy);
  setSortDirection(newSortDirection);
 };

 // Обработчики для изменения значений фильтров
 const handleYearChange = (e) => {
  setSelectedYear(e.target.value);
 };

 const handleMakeChange = (e) => {
  setSelectedMake(e.target.value);
 };

 const handleMinPriceChange = (e) => {
  setMinPrice(e.target.value);
 };

 const handleMaxPriceChange = (e) => {
  setMaxPrice(e.target.value);
 };

 // Обработчик для сброса фильтров
 const resetFilters = () => {
  setSelectedYear("");
  setSelectedMake("");
  setMinPrice("");
  setMaxPrice("");
  setFilteredBikes(bikes); // Возвращаем все мотоциклы
 };

 // Получаем уникальные года и бренды
 const uniqueYears = [...new Set(bikes.map((bike) => bike.year))];
 const uniqueMakes = [...new Set(bikes.map((bike) => bike.make))];

 const handleEditPrice = (id, newPrice) => {
  fetch(`https://bike-shop-backend-dhvt.onrender.com/api/bikes/${id}/price`, {
   method: "PUT",
   headers: {
    "Content-Type": "application/json",
   },
   body: JSON.stringify({ price: newPrice }), // Отправляем новую цену
  })
   .then((response) => response.json())
   .then((updatedBike) => {
    // Обновляем цену на клиенте после успешного изменения
    setBikes((prevBikes) =>
     prevBikes.map((bike) =>
      bike._id === updatedBike._id ? updatedBike : bike
     )
    );
    setFilteredBikes((prevFilteredBikes) =>
     prevFilteredBikes.map((bike) =>
      bike._id === updatedBike._id ? updatedBike : bike
     )
    );
    setEditPriceBike(null); // Закрываем окно редактирования
   })
   .catch((error) => console.error("Error editing price:", error));
 };

 // Обработчик пометки как "sold"
 const handleMarkAsSold = (id, isSold) => {
  fetch(`https://bike-shop-backend-dhvt.onrender.com/api/bikes/${id}/sold`, {
   method: "PUT",
   headers: {
    "Content-Type": "application/json",
   },
   body: JSON.stringify({ sold: !isSold }), // Переключаем статус sold
  })
   .then((response) => response.json())
   .then((updatedBike) => {
    // Обновляем состояние с помеченным как "sold" или "back to market" мотоциклом
    setBikes((prevBikes) =>
     prevBikes.map((bike) =>
      bike._id === updatedBike._id ? updatedBike : bike
     )
    );
    setFilteredBikes((prevFilteredBikes) =>
     prevFilteredBikes.map((bike) =>
      bike._id === updatedBike._id ? updatedBike : bike
     )
    );
   })
   .catch((error) => console.error("Error marking as sold:", error));
};



 return (
  isAuthenticated && (
   <div>
    <LogoutBtn />
    <div className="filter-form">
     <h3>Filter Bikes</h3>
     <form>
      <div>
       <label htmlFor="make">Brand:</label>
       <select id="make" value={selectedMake} onChange={handleMakeChange}>
        <option value="">Select Brand</option>
        {uniqueMakes.map((make) => (
         <option key={make} value={make}>
          {make}
         </option>
        ))}
       </select>
      </div>
      <div>
       <label htmlFor="year">Year:</label>
       <select id="year" value={selectedYear} onChange={handleYearChange}>
        <option value="">Select Year</option>
        {uniqueYears.map((year) => (
         <option key={year} value={year}>
          {year}
         </option>
        ))}
       </select>
      </div>
      <div>
       <label htmlFor="minPrice">Min Price:</label>
       <input
        type="number"
        id="minPrice"
        value={minPrice}
        onChange={handleMinPriceChange}
        placeholder="Enter min price"
       />
      </div>
      <div>
       <label htmlFor="maxPrice">Max Price:</label>
       <input
        type="number"
        id="maxPrice"
        value={maxPrice}
        onChange={handleMaxPriceChange}
        placeholder="Enter max price"
       />
      </div>
      <div>
       <button type="button" onClick={filterBikes} className="filter-btn">
        Apply Filters
       </button>
       <button type="button" onClick={resetFilters} className="reset-btn">
        Reset Filters
       </button>
      </div>
      {/* Сортировка */}
      <div>
       <label htmlFor="sort">Sort By:</label>
       <select id="sort" onChange={handleSortChange} value={sortBy}>
        <option value="">Select Sort Option</option>
        <option value="price">Price</option>
        <option value="year">Year</option>
        <option value="make">Brand</option>
       </select>
      </div>
     </form>
    </div>

    <div className="bike-list">
     {filteredBikes.length === 0 ? (
      <p>No bikes found with the selected filters.</p>
     ) : (
      filteredBikes.map((bike) => (
       <div className="bike-item" key={bike._id}>
        <h2 className="bike-make">{bike.make}</h2>
        <h2 className="bike-model">{bike.model}</h2>
        <p>Year: {bike.year}</p>
        <p className={`bike-price ${bike.sold ? "sold-price" : ""}`}>
         ${bike.price} {bike.sold && <span className="sold-label">Sold</span>}
        </p>
        <img
         src={`https://bike-shop-backend-dhvt.onrender.com${bike.image}`}
         alt={bike.model}
         className={`bike-pic ${bike.sold ? "bike-sold" : ""}`} // Класс для черно-белого изображения
        />
        <div className="edit-buttons">
         <div className="bike-actions">
          {/* Кнопка для пометки как проданный или возвращения на рынок */}
          <button onClick={() => handleMarkAsSold(bike._id, bike.sold)}>
           {bike.sold ? "Back to Market" : "Mark as Sold"}
          </button>
         </div>

         <button onClick={() => setEditPriceBike(bike)}>Edit Price</button>
        </div>
        {/* Форма редактирования цены, если это нужный мотоцикл */}
        {editPriceBike && editPriceBike._id === bike._id && (
         <div className="edit-price-form">
          <input
           type="number"
           defaultValue={bike.price}
           onChange={(e) => (bike.price = e.target.value)}
          />
          <button onClick={() => handleEditPrice(bike._id, bike.price)}>
           Save New Price
          </button>
          <button onClick={() => setEditPriceBike(null)}>Cancel</button>
         </div>
        )}
       </div>
      ))
     )}
    </div>
   </div>
  )
 );
};

export default BikeList;
