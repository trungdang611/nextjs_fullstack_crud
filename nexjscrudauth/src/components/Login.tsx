"use client";

import authAxios from "@/util/axios.config";
import React, { useState } from "react";

export default function Login() {
  const [name, setName] = useState("");

  console.log("Name:: ", name);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // name = e.target.value.name;
    console.log("name:: ", name);

    await authAxios
      .post("/api/users/login", {
        name: name,
      })
      .then((res) => {
        console.log("res:: ", res.data);
      })
      .catch((err) => {
        console.log("err:: ", err);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}
