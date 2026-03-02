from fastapi import APIRouter, Depends
from typing import List
import numpy as np
from scipy import stats
from asyncpg import Connection
from pydantic import BaseModel

router = APIRouter()

# -------------------------------
# Pydantic models for input data
# -------------------------------
class ShapiroInput(BaseModel):
    numbers: List[float]

class MannWhitneyInput(BaseModel):
    group1: List[float]
    group2: List[float]

class StudentsTInput(BaseModel):
    group1: List[float]
    group2: List[float]

# -------------------------------
# Statistical endpoints
# -------------------------------
@router.post("/preposcovid/shapiro-wilk")
async def shapiro_wilk_test(input_data: ShapiroInput):
    numbers = np.array(input_data.numbers)
    if len(numbers) < 3:
        return {"error": "Shapiro-Wilk requires at least 3 values."}

    stat, p_value = stats.shapiro(numbers)
    result = "Likely Normal" if p_value > 0.05 else "Not Normal"
    mean_value = np.mean(numbers)
    stddev_value = np.std(numbers, ddof=1)  # Sample std deviation

    return {
        "statistic": stat,
        "p_value": p_value,
        "result": result,
        "mean": mean_value,
        "stddev": stddev_value
    }

@router.post("/preposcovid/mannwhitney")
async def mann_whitney(input_data: MannWhitneyInput):
    stat, p_value = stats.mannwhitneyu(input_data.group1, input_data.group2)
    significance = "NO" if p_value > 0.05 else "YES"
    return {"test_name": "Mann-Whitney U test", "statistic": stat, "p_value": p_value, "significance": significance}

@router.post("/preposcovid/students_t")
async def students_t(input_data: StudentsTInput):
    stat, p_value = stats.ttest_ind(input_data.group1, input_data.group2)
    significance = "NO" if p_value > 0.05 else "YES"
    return {"test_name": "Student's t-test", "statistic": stat, "p_value": p_value, "significance": significance}
