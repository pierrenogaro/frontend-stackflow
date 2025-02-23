import Questions from "@/components/Questions/Questions.vue";
import Question from "@/components/Questions/Question.vue";

export const routes = [
    {path: '/questions', component : Questions},
    {path: '/question/:id', component : Question},
]