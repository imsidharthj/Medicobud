import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form as ShadcnForm,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import Autocomplete from './data/autocomplete';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  age: z.string().min(1, {
    message: "Age is required.",
  }).refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num >= 1 && num <= 100;
  }, {message: 'Age must be in range of 1 to 100.'}),
  allergies: z.string().optional(),
  symptoms: z.array(z.string()).min(1, {
    message: "At least one symptom is required.",
  }),
});

interface FormProps {
  name: string;
  age: string;
  allergies: string;
  symptoms: string[];
  formErrors: {
    name: string;
    age: string;
    symptoms: string[];
    allergies: string;
  };
  setName: (value: string) => void;
  setAge: (value: string) => void;
  setAllergies: (value: string) => void;
  setSymptoms: (value: string[]) => void;
  handleSubmit: (data: {
    name: string;
    age: string;
    symptoms: string[];
    allergies?: string;
  }) => void;
}

function Form({
  name,
  age,
  allergies,
  symptoms,
  setName,
  setAge,
  setAllergies,
  setSymptoms,
  handleSubmit,
}: FormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name,
      age,
      allergies,
      symptoms,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setName(data.name);
    setAge(data.age);
    setAllergies(data.allergies || '');
    setSymptoms(data.symptoms);
    handleSubmit(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Information</CardTitle>
        <CardDescription className='text-gray-600'>Please fill out the form below to get your diagnosis</CardDescription>
      </CardHeader>
      <CardContent>
        <ShadcnForm {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" {...field}
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allergies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allergies</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Symptoms</FormLabel>
              <FormControl>
                <Autocomplete
                  selectedSymptoms={symptoms}
                  onSymptomsChange={(updatedSymptoms) => {
                    setSymptoms(updatedSymptoms);
                    form.setValue("symptoms", updatedSymptoms);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </ShadcnForm>
      </CardContent>
    </Card>
  );
}

export default Form;