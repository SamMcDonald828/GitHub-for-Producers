import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { Button } from "~/components/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/components/ui/card";
import { Input } from "~/components/components/ui/input";
import { createProject } from "~/models/project.server";
import { requireUserId } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { body: null, title: "Title is required" } },
      { status: 400 },
    );
  }

  if (typeof body !== "string" || body.length === 0) {
    return json(
      { errors: { body: "Body is required", title: null } },
      { status: 400 },
    );
  }

  const project = await createProject({ body, title, userId });

  return redirect(`/dashboard/library/${project.id}`);
};

export default function NewProjectPage() {
  const actionData = useActionData<typeof action>();
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form method="post">
      <Card className="w-[310px]">
        <CardHeader>
          <CardTitle>Create project</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid items-center w-full gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Title</Label>
              <Input
                className="rounded"
                id="title"
                name="title"
                placeholder="Name of your project"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="body">Body</Label>
              <Input
                className="rounded"
                id="body"
                name="body"
                placeholder="description of your project"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="mainfolder">Main folder</Label>
              <Input
                className="rounded"
                id="mainfolder"
                name="mainfolder"
                placeholder='This is your "main branch" for your production you can name it here'
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit">Create</Button>
        </CardFooter>
      </Card>
    </Form>
  );
}
