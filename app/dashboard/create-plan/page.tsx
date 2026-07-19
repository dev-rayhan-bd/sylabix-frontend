"use client";

import { CreatePlanWizard } from "@/src/components/dashboard/CreatePlanWizard";
import { motion } from "framer-motion";

export default function CreatePlanPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-foreground">
          Create <span className="text-gradient">Study Plan</span>
        </h1>
        <p className="mt-1 text-muted-foreground">
          Upload your syllabus and let AI build a personalized study schedule
        </p>
      </motion.div>

      <CreatePlanWizard />
    </div>
  );
}
