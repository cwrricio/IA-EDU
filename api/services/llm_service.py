import os
import json
import re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

class LLMService:
    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")
        
        self.client = Groq(api_key=api_key)
        self.model = "llama-3.3-70b-versatile"  # editável
    
    async def generate_objectives(self, context):
        """Generate educational objectives based on context"""
        prompt = f"""
        Based on the following educational context, generate a comprehensive set of learning objectives.
        Include one general objective and 3-5 specific objectives.
        
        Context: {context}
        
        Format the response as a valid JSON object with the following structure:
        {{
            "general": "The general objective statement",
            "specific": [
                {{"id": "1", "text": "First specific objective"}},
                {{"id": "2", "text": "Second specific objective"}},
                {{"id": "3", "text": "Third specific objective"}}
            ]
        }}
        
        IMPORTANT: Make sure the JSON is properly formatted with all curly braces and brackets correctly balanced.
        Each object in the 'specific' array MUST have a closing curly brace.
        DO NOT use code block markers (```) in your response.
        """
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are an educational AI assistant that helps create well-structured learning objectives. You output properly formatted JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000,
        )
        
        content = response.choices[0].message.content
        return self._clean_and_validate_json(content)
    
    async def generate_syllabus(self, context):
        """Generate a course syllabus based on context"""
        prompt = f"""
        Based on the following educational context, generate a course syllabus with relevant topics.
        
        Context: {context}
        
        Format the response as a JSON object with the following structure:
        {{
            "topics": [
                {{"id": 1, "title": "Topic title", "depth": 3}},
                {{"id": 2, "title": "Another topic", "depth": 4}},
                ...
            ]
        }}
        Where depth is a value from 1-5 indicating the recommended depth of coverage.
        
        IMPORTANT: Make sure the JSON is properly formatted. DO NOT use code block markers (```) in your response.
        """
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are an educational AI assistant that helps create well-structured course syllabi. You output properly formatted JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000,
        )
        
        content = response.choices[0].message.content
        return self._clean_and_validate_json(content)
    
    def _clean_and_validate_json(self, content):
        """Clean and validate JSON from LLM response"""
        # Remove code block markers if present
        cleaned_content = content.strip()
        if cleaned_content.startswith("```"):
            parts = cleaned_content.split("```")
            if len(parts) >= 3:
                # Extract the middle part (actual JSON)
                cleaned_content = parts[1]
                # Remove language identifier if present
                if cleaned_content.startswith("json"):
                    cleaned_content = cleaned_content[4:].strip()
                else:
                    cleaned_content = cleaned_content.strip()
        
        # Fix common JSON structure errors
        try:
            # Try parsing directly first
            return json.loads(cleaned_content)
        except json.JSONDecodeError:
            # Fix missing closing braces in array items
            fixed_content = re.sub(r'("text": "[^"]+?")(\s*\])', r'\1}\2', cleaned_content)
            
            # Fix extra closing braces at the end
            bracket_count = 0
            brace_count = 0
            for char in fixed_content:
                if char == '{': brace_count += 1
                elif char == '}': brace_count -= 1
                elif char == '[': bracket_count += 1
                elif char == ']': bracket_count -= 1
            
            # Add missing closing braces/brackets or remove extras
            if brace_count > 0:
                fixed_content += '}' * brace_count
            elif brace_count < 0:
                fixed_content = fixed_content.rsplit('}', -brace_count)[0]
            
            if bracket_count > 0:
                fixed_content += ']' * bracket_count
            elif bracket_count < 0:
                fixed_content = fixed_content.rsplit(']', -bracket_count)[0]
            
            return json.loads(fixed_content)
    
    async def process_document(self, document_content):
        """Extract key information from an educational document"""
        prompt = f"""
        Please analyze this educational document and extract key information that could be useful for course planning.
        
        Document content: {document_content}
        
        Identify main topics, learning objectives, and recommended teaching approaches.
        """
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are an educational AI assistant that specializes in analyzing educational documents."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            max_tokens=1500,
        )
        
        # Extract and return the generated content
        return response.choices[0].message.content