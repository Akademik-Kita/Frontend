export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  photoPosition: string;
}

// Simpan foto di public/team, lalu isi photo, misalnya '/team/anggota-01.jpg'.
export const teamMembers: TeamMember[] = [
  { id: 'anggota-01', name: 'Ivana Tiara Harsono', role: 'Frontend Developer', photo: '/team/ivana.jpeg', photoPosition: 'center' },
  { id: 'anggota-02', name: 'Devie Raysha Putri', role: 'Frontend Developer', photo: '/team/raysha.jpeg', photoPosition: 'center' },
  { id: 'anggota-03', name: 'Haikal Ahza Anggera', role: 'Backend Developer', photo: '/team/tomoko.jpg', photoPosition: 'center' },
  { id: 'anggota-04', name: 'Athallah Abrar Duano', role: 'DevOps Developer', photo: '/team/duano.jpeg', photoPosition: 'center' },
];
