import OpenAI, { ClientOptions } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const configuration = {
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
} as ClientOptions;

const openai = new OpenAI(configuration);

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Only POST requests are allowed' });
  }

  const { prompt } = await req.json();

  if (!prompt || prompt.trim().length === 0) {
    return NextResponse.json({ message: 'Prompt is required' }, { status: 400 });
  }

  try {
    // Using the new chat.completions.create API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: prompt },
      ],
    });

    const aiResponse = completion?.choices[0]?.message?.content?.trim();

    console.info('AI response:', aiResponse);

    return NextResponse.json({ text: aiResponse }, { status: 200 });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return NextResponse.json({ message: 'Error generating response from OpenAI API' }, { status: 500 });
  }
}
