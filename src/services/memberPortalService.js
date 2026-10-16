export const DEFAULT_WORKOUT_PLAN = {
  dayTitle: 'Legs & Core Power (Strength Periodization)',
  targetMuscle: 'Quadriceps, Hamstrings, Glutes & Core',
  trainerName: 'Arjun Sharma',
  estimatedTime: '65 Mins',
  difficulty: 'Advanced',
  exercises: [
    {
      id: 'ex-1',
      name: 'Barbell Back Squat',
      muscle: 'Quadriceps & Glutes',
      equipment: 'Eleiko Olympic Barbell',
      sets: 4,
      reps: '6-8',
      targetWeight: '110 KG',
      rest: '120s',
      completed: true,
      instructions: 'Keep chest upright, brace core with Valsalva maneuver, break parallel.'
    },
    {
      id: 'ex-2',
      name: 'Romanian Deadlift (RDL)',
      muscle: 'Hamstrings & Posterior Chain',
      equipment: 'Barbell & Lifting Straps',
      sets: 3,
      reps: '8-10',
      targetWeight: '90 KG',
      rest: '90s',
      completed: true,
      instructions: 'Hinge hips backwards, feel stretch in hamstrings, avoid rounding lower back.'
    },
    {
      id: 'ex-3',
      name: 'Bulgarian Split Squat',
      muscle: 'Quads & Unilateral Balance',
      equipment: 'Dumbbells',
      sets: 3,
      reps: '10 / leg',
      targetWeight: '22 KG Each',
      rest: '60s',
      completed: false,
      instructions: 'Rear foot elevated on bench, drop back knee straight towards floor.'
    },
    {
      id: 'ex-4',
      name: 'Hanging Leg Raises',
      muscle: 'Lower Abdominals',
      equipment: 'Rig / Pull-up Bar',
      sets: 3,
      reps: '12-15',
      targetWeight: 'Bodyweight',
      rest: '45s',
      completed: false,
      instructions: 'Control the descent, avoid swinging hips, tuck pelvis at the peak.'
    }
  ]
};

export const DEFAULT_DIET_PLAN = {
  title: 'Lean Muscle Hypertrophy & Fat Loss Protocol',
  dailyCalorieTarget: 2450,
  proteinTarget: '175g',
  carbsTarget: '260g',
  fatsTarget: '65g',
  waterTarget: '4.0 Litres',
  meals: [
    {
      meal: 'Meal 1: High-Protein Breakfast',
      time: '08:00 AM',
      items: '4 Whole Organic Eggs, 2 Slices Sourdough Toast, 1 Cup Black Coffee',
      calories: 520,
      protein: '34g',
      carbs: '42g',
      fats: '22g'
    },
    {
      meal: 'Meal 2: Mid-Morning Snack',
      time: '11:30 AM',
      items: 'Greek Yogurt (200g) with Blueberries, Raw Almonds (25g)',
      calories: 310,
      protein: '22g',
      carbs: '28g',
      fats: '12g'
    },
    {
      meal: 'Meal 3: Pre-Workout Lunch',
      time: '02:00 PM',
      items: 'Grilled Chicken Breast (180g), Brown Basmati Rice (1 Cup), Steamed Broccoli',
      calories: 640,
      protein: '48g',
      carbs: '70g',
      fats: '14g'
    },
    {
      meal: 'Meal 4: Post-Workout Fuel Shake',
      time: '06:30 PM',
      items: '1 Scoop Whey Isolate, 1 Large Banana, 300ml Skim Milk',
      calories: 380,
      protein: '36g',
      carbs: '46g',
      fats: '4g'
    },
    {
      meal: 'Meal 5: Recovery Dinner',
      time: '09:00 PM',
      items: 'Grilled Salmon fillet or Paneer tikka, Sautéed Spinach, Sweet Potato (150g)',
      calories: 580,
      protein: '35g',
      carbs: '60g',
      fats: '13g'
    }
  ]
};

export const DEFAULT_PROGRESS_HISTORY = [
  { date: 'Aug 10', weight: 88.5, bodyFat: 24.2, chest: 104, waist: 94, arms: 36 },
  { date: 'Sep 10', weight: 85.0, bodyFat: 21.5, chest: 105, waist: 90, arms: 37 },
  { date: 'Oct 01', weight: 82.8, bodyFat: 19.8, chest: 106, waist: 86, arms: 37.5 },
  { date: 'Oct 15', weight: 81.2, bodyFat: 18.4, chest: 107, waist: 83, arms: 38 }
];

export const getMemberProgress = () => {
  const stored = localStorage.getItem('kinetix_member_progress');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  localStorage.setItem('kinetix_member_progress', JSON.stringify(DEFAULT_PROGRESS_HISTORY));
  return DEFAULT_PROGRESS_HISTORY;
};

export const saveProgressEntry = (entry) => {
  const current = getMemberProgress();
  const updated = [...current, { ...entry, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }];
  localStorage.setItem('kinetix_member_progress', JSON.stringify(updated));
  window.dispatchEvent(new Event('kinetix_progress_updated'));
  return updated;
};
