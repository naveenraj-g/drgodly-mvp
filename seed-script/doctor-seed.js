"use server"

import { prismaTelemedicine } from "../src/modules/server/prisma/prisma";
import { specialties, servicesBySpecialty } from "./data";

const orgId = "4f8723d9-16c8-4ecb-b65d-d068865aff6f";
const createdBy = "MpnipkLj8ggDyTKuYFnUi67u6WmelEks";

const doctors = specialties.map((speciality, index) => ({
    // userId: `user-doctor-${index + 1}`,
    fullName: `Dr ${speciality} Specialist`,
    speciality,
    department: speciality,
    experience: `${6 + index} years`,
}));

export async function seedDoctors() {
    for (let i = 0; i < doctors.length; i++) {
        const d = doctors[i];

        await prismaTelemedicine.doctor.create({
            data: {
                orgId,
                // userId: d.userId,
                isCompleted: true,
                isABDMDoctorProfile: false,
                // registrationNumber: `REG-${2000 + i}`,
                // registrationProvider: "Medical Council of India",
                createdBy,
                updatedBy: createdBy,

                /* ---------------- PERSONAL ---------------- */
                personal: {
                    create: {
                        orgId,
                        title: "Dr",
                        fullName: d.fullName,
                        nationality: "Indian",
                        dateOfBirth: new Date(1980 + i, 5, 15),
                        gender: i % 2 === 0 ? "male" : "female",
                        mobileNumber: `90000000${i}`,
                        email: `doctor.${i + 1}@example.com`,
                        speciality: d.speciality,
                        createdBy,
                        updatedBy: createdBy,

                        languagesSpoken: {
                            create: [
                                { orgId, langCode: "english", createdBy, updatedBy: createdBy },
                                { orgId, langCode: "hindi", createdBy, updatedBy: createdBy },
                            ],
                        },

                        socialAccounts: {
                            create: [
                                {
                                    orgId,
                                    platform: "linkedin",
                                    url: `https://linkedin.com/in/doctor-${i + 1}`,
                                    createdBy,
                                    updatedBy: createdBy,
                                },
                            ],
                        },

                        kycAddress: {
                            create: {
                                orgId,
                                careOf: "Self",
                                addressLine: "Medical College Road",
                                city: "New Delhi",
                                district: "Central Delhi",
                                state: "Delhi",
                                pincode: "110001",
                                createdBy,
                                updatedBy: createdBy,
                            },
                        },

                        communicationAddress: {
                            create: {
                                orgId,
                                sameAsKyc: true,
                                createdBy,
                                updatedBy: createdBy,
                            },
                        },
                    },
                },

                /* ---------------- QUALIFICATION ---------------- */
                qualification: {
                    create: {
                        orgId,
                        systemOfMedicine: "Allopathy",
                        category: "doctor",
                        councilName: "MCI",
                        registrationNumber: `MCI-${3000 + i}`,
                        dateOfFirstRegistration: new Date(2008 + i, 0, 1),
                        registrationType: "permanent",
                        nameMatchesAadhaar: true,
                        createdBy,
                        updatedBy: createdBy,

                        qualifications: {
                            create: [
                                {
                                    orgId,
                                    countryOfQualification: "India",
                                    degreeName: "MBBS",
                                    country: "India",
                                    state: "Delhi",
                                    college: "AIIMS",
                                    university: "AIIMS University",
                                    passingMonth: "May",
                                    passingYear: "2006",
                                    nameMatchesAadhaar: true,
                                    createdBy,
                                    updatedBy: createdBy,
                                },
                                {
                                    orgId,
                                    countryOfQualification: "India",
                                    degreeName: `MD (${d.speciality})`,
                                    country: "India",
                                    state: "Delhi",
                                    college: "AIIMS",
                                    university: "AIIMS University",
                                    passingMonth: "June",
                                    passingYear: "2009",
                                    nameMatchesAadhaar: true,
                                    createdBy,
                                    updatedBy: createdBy,
                                },
                            ],
                        },
                    },
                },

                /* ---------------- WORK ---------------- */
                workDetail: {
                    create: {
                        orgId,
                        currentlyWorking: true,
                        experience: d.experience,
                        natureOfWork: "Clinical Practice",
                        teleConsultationURL: `https://tele.health/doctor-${i + 1}`,
                        workStatus: i % 3 === 0 ? "government" : "private",
                        governmentCategory: i % 3 === 0 ? "central" : null,
                        centralGovernment: i & 3 === 0 ? "Ministry of Health and Family Welfare" : null,
                        about: `Experienced ${d.speciality} specialist with strong clinical background.`,
                        createdBy,
                        updatedBy: createdBy,

                        workingFacilityDetails: {
                            create: [
                                {
                                    orgId,
                                    facilityId: `FAC-${i + 1}`,
                                    facilityStatus: true,
                                    facilityName: "National Medical Center",
                                    address: "Ring Road",
                                    state: "Delhi",
                                    district: "New Delhi",
                                    type: "Hospital",
                                    department: d.department,
                                    designation: "Consultant",
                                    createdBy,
                                    updatedBy: createdBy,
                                },
                            ],
                        },
                    },
                },

                /* ---------------- CONCENT ---------------- */
                concent: {
                    create: {
                        orgId,
                        isAgreeToShowDetailsPublic: true,
                        name: true,
                        systemOfMedicine: true,
                        qualification: true,
                        experience: true,
                        email: false,
                        contactNumber: false,
                        placeOfWork: true,
                        profilePicture: true,
                        languageSpoken: true,
                        workStatus: true,
                        teleConsultation: true,
                        isDeclearedToCreateDoctorAccount: true,
                        createdBy,
                        updatedBy: createdBy,
                    },
                },
            },
        });
    }

    console.log("✅ Seeded 16 doctors (one per specialty)");
}

///////////////////////////////////////////////////

export async function seedDoctorServices() {
    const doctors = await prismaTelemedicine.doctor.findMany({
        where: {
            orgId,
            doctorType: "HUMAN",
        },
        select: {
            id: true,
            userId: true,
            personal: {
                select: {
                    speciality: true,
                },
            },
        },
    });

    for (const d of doctors) {
        const speciality = d.personal?.speciality;
        if (!speciality) continue;

        const services = servicesBySpecialty[speciality];
        if (!services || services.length === 0) continue;

        await prismaTelemedicine.service.createMany({
            data: services.map((s) => ({
                orgId,
                doctorId: d.id,
                name: s.name,
                duration: s.duration,
                priceAmount: s.priceAmount,
                priceCurrency: "INR",
                description: s.description,
                supportedModes: s.supportedModes.map(m => m === "in-person" ? "INPERSON" : "VIRTUAL"),
                createdBy: d.userId ?? "seed",
                updatedBy: d.userId ?? "seed",
            })),
            skipDuplicates: true,
        });
    }

    console.log("✅ Doctor services seeded successfully");
}
