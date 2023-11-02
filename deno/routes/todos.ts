import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { getDb } from "../helpers/db_client.ts";
import { Bson } from "https://deno.land/x/mongo@v0.29.2/mod.ts";
const router = new Router();

interface Todo {
  id?: string;
  text: string;
}

router.get("/todos", async (ctx) => {
  const todos = await getDb().collection("todos").find().toArray();
  const transformedTodos = todos.map((todo) => {
    return { id: todo._id.$oid, text: todo.text };
  });
  ctx.response.body = { todos: transformedTodos };
});

router.post("/todos", async (ctx) => {
  const { text } = await ctx.request.body().value;
  const newTodo: Todo = {
    text: text,
  };

  const id = await getDb().collection("todos").insertOne(newTodo);
  newTodo.id = id.$oid;

  ctx.response.body = { message: "Created todo!", todo: newTodo };
});

router.put("/todos/:todoId", async (ctx) => {
  const tid = ctx.params.todoId!;
  const { text } = await ctx.request.body().value;

  await getDb()
    .collection("todos")
    .updateOne(
      { _id: new Bson.ObjectId(tid) },
      {
        $set: { text: text },
      },
    );
  ctx.response.body = { message: "Updated todo" };
});

router.delete("/todos/:todoId", async (ctx) => {
  console.log(ctx.params);

  const tid = ctx.params.todoId!;
  console.log("Params", tid);
  await getDb()
    .collection("todos")
    .deleteOne({ _id: new Bson.ObjectId(tid) });
  ctx.response.body = { message: "Deleted todo" };
});

export default router;
