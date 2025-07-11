import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { insertUserSchema } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

const signupSchema = insertUserSchema.extend({
  role: z.enum(["student", "alumni", "faculty"]),
});

type SignupData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onComplete: () => void;
}

export function SignupForm({ onComplete }: SignupFormProps) {
  const { firebaseUser, getIdToken } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const { data: colleges = [] } = useQuery({
    queryKey: ["/api/colleges"],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firebaseUid: firebaseUser?.uid || "",
      email: firebaseUser?.email || "",
      name: firebaseUser?.displayName || "",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: SignupData) => {
    setLoading(true);
    try {
      const token = await getIdToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create account");
      }

      toast({
        title: "Account created successfully!",
        description: "Welcome to KnowZone. You can now access all features.",
      });

      onComplete();
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Error creating account",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            {...register("name")}
            error={errors.name?.message}
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            error={errors.email?.message}
            disabled
          />
        </div>
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <Select onValueChange={(value) => setValue("role", value as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="alumni">Alumni</SelectItem>
            <SelectItem value="faculty">Faculty</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="collegeId">College</Label>
          <Select onValueChange={(value) => setValue("collegeId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select college" />
            </SelectTrigger>
            <SelectContent>
              {colleges.map((college: any) => (
                <SelectItem key={college.id} value={college.id}>
                  {college.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.collegeId && (
            <p className="text-sm text-red-600 mt-1">{errors.collegeId.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            {...register("department")}
            error={errors.department?.message}
            placeholder="e.g., Computer Science"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="branch">Branch</Label>
        <Input
          id="branch"
          {...register("branch")}
          error={errors.branch?.message}
          placeholder="e.g., CSE, ECE, Mechanical"
        />
      </div>

      {/* Student/Alumni specific fields */}
      {(selectedRole === "student" || selectedRole === "alumni") && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="usn">USN</Label>
            <Input
              id="usn"
              {...register("usn")}
              error={errors.usn?.message}
              placeholder="University Seat Number"
            />
          </div>

          <div>
            <Label htmlFor="batch">Batch</Label>
            <Input
              id="batch"
              {...register("batch")}
              error={errors.batch?.message}
              placeholder="e.g., 2020-2024"
            />
          </div>

          <div>
            <Label htmlFor="year">Year</Label>
            <Select onValueChange={(value) => setValue("year", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1st Year</SelectItem>
                <SelectItem value="2">2nd Year</SelectItem>
                <SelectItem value="3">3rd Year</SelectItem>
                <SelectItem value="4">4th Year</SelectItem>
                <SelectItem value="graduated">Graduated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={(value) => setValue("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Student</SelectItem>
                <SelectItem value="alumni">Alumni</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Faculty specific fields */}
      {selectedRole === "faculty" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input
              id="employeeId"
              {...register("employeeId")}
              error={errors.employeeId?.message}
            />
          </div>

          <div>
            <Label htmlFor="designation">Designation</Label>
            <Input
              id="designation"
              {...register("designation")}
              error={errors.designation?.message}
              placeholder="e.g., Assistant Professor"
            />
          </div>

          <div>
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              type="number"
              {...register("experience", { valueAsNumber: true })}
              error={errors.experience?.message}
            />
          </div>

          <div>
            <Label htmlFor="subjects">Subjects (comma-separated)</Label>
            <Input
              id="subjects"
              {...register("subjects")}
              placeholder="e.g., Data Structures, Algorithms"
              onChange={(e) => {
                const subjects = e.target.value.split(",").map(s => s.trim());
                setValue("subjects", subjects);
              }}
            />
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="linkedinUrl">LinkedIn Profile (Optional)</Label>
        <Input
          id="linkedinUrl"
          {...register("linkedinUrl")}
          error={errors.linkedinUrl?.message}
          placeholder="https://linkedin.com/in/yourprofile"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating Account..." : "Complete Profile"}
      </Button>
    </form>
  );
}
