"use server"

import { hash } from "bcrypt"
import { z } from "zod"
import prisma from "@/lib/prisma"

// Schema for registration validation
const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
    newsletter: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type RegisterFormData = z.infer<typeof registerSchema>

export async function registerUser(formData: RegisterFormData) {
  try {
    // Validate form data
    const validatedData = registerSchema.parse(formData)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: validatedData.email,
      },
    })

    if (existingUser) {
      return {
        success: false,
        message: "User with this email already exists",
      }
    }

    // Hash the password
    const hashedPassword = await hash(validatedData.password, 10)

    // Create the user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        name: `${validatedData.firstName} ${validatedData.lastName}`,
        phone: validatedData.phone,
        notificationPreferences: {
          create: {
            orderUpdates: true,
            promotions: validatedData.newsletter || false,
            newArrivals: validatedData.newsletter || false,
            blogPosts: validatedData.newsletter || false,
          },
        },
      },
    })

    return {
      success: true,
      message: "Registration successful",
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      }
    }

    return {
      success: false,
      message: "An error occurred during registration",
    }
  }
}

