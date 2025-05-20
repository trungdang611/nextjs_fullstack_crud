export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();
  const { name } = body;

  console.log("name:: ", name);

  // e.g. Insert new user into your DB
  //   const newUser = { id: Date.now(), name };

  //   return new Response(JSON.stringify(newUser), {
  //     status: 201,
  //     headers: { "Content-Type": "application/json" },
  //   });
  return new Response(JSON.stringify({ message: "User logged in 123" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
