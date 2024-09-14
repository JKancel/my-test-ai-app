'use client';

import { useState } from 'react';

import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';


const formSchema = z.object({
  prompt: z.string(),
})

export default function Home() {
  const [response, setResponse] = useState<string>('');
  // const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast, dismiss } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });
  
  const onSubmit = async ({ prompt }: z.infer<typeof formSchema>) => {
    // setLoading(true);
    setError(null);
    setResponse('');
    toast({
      title: "Submitting...",
      description: "Generating a Response.",
    })

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (res.status !== 200) {
        setError(data.message || 'Something went wrong');
      } else {
        setResponse(data.text);
      }
    } catch (err) {
      setError('Error fetching response');
    } finally {
      // setLoading(false);
      dismiss();
    }
  };

  return (
    <Theme>
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-xl shadow-lg max-w-lg w-full">
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-gray-900 text-lg font-medium mb-1'><Label>Ask to the AI</Label></FormLabel>
                <FormControl>
                    <Textarea
                      placeholder="Describe your intention..."
                      rows={5}
                      className='bg-white border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 rounded-md p-4 text-gray-900 shadow-sm transition-all duration-200'
                      {...field}
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className='w-full bg-gray-600 text-white py-3 rounded-lg shadow-md hover:bg-gray-700 transition-all duration-200'>
            Submit
          </Button>
        </form>

      {/* {loading && (
          <Toast>
            <ToastTitle>Submitting...</ToastTitle>
            <ToastDescription>Generating a Response.</ToastDescription>
          </Toast>
        )} */}
      {error && <Alert variant="destructive" className="mt-4 max-w-lg mx-auto">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>}
      {response && (
        <Alert variant="default" className="mt-4 max-w-lg mx-auto">
          <AlertDescription>{response}</AlertDescription>
        </Alert>
      )}
    </Form>
    </div>
    <Toaster />
    </Theme>
  );
}
