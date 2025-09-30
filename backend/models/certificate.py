# models/certificate.py
# Certificate models for API requests/responses

from __future__ import annotations

from datetime import datetime
from typing import Optional, Literal

from pydantic import BaseModel, Field, ConfigDict, field_validator


class CertificateIssueRequest(BaseModel):
    """Client payload for issuing a certificate (hash is computed server-side)."""
    model_config = ConfigDict(
        extra="forbid",
        json_schema_extra={
            "example": {
                "student_name": "Ada Lovelace",
                "student_email": "ada@example.edu",
                "institution": "University of Lagos",
                "degree": "B.Sc. Computer Science",
                "graduation_year": 2024,
                "cgpa": 4.85,
                "reg_number": "CSC/18/1234",
                "honours": "First Class",
                "state_of_origin": "Kaduna"
            }
        },
    )

    student_name: str = Field(..., min_length=1)
    student_email: Optional[str] = Field(default=None)
    institution: str = Field(..., min_length=1)
    degree: str = Field(..., min_length=1)
    graduation_year: int = Field(..., ge=1950, le=datetime.utcnow().year + 1)
    cgpa: Optional[float] = Field(default=None, ge=0, le=5)
    reg_number: Optional[str] = None
    honours: Optional[str] = None
    state_of_origin: Optional[str] = None

    @field_validator("student_name", "student_email", "institution", "degree", "reg_number", "honours", "state_of_origin")
    @classmethod
    def trim_str(cls, v: Optional[str]) -> Optional[str]:
        return v.strip() if isinstance(v, str) else v


class CertificateRecord(BaseModel):
    """Representation of a persisted certificate record returned to clients."""
    student_name: str
    student_email: Optional[str] = None
    institution: str
    degree: str
    graduation_year: int
    cgpa: Optional[float] = None
    reg_number: Optional[str] = None
    honours: Optional[str] = None
    state_of_origin: Optional[str] = None

    hash: str
    issued_by: Optional[str] = None
    issuer_email: Optional[str] = None
    created_at: Optional[datetime] = None


class IssueResponse(BaseModel):
    message: str
    certificate: CertificateRecord
    issued_by: str
    blockchain_stored: Optional[bool] = None
