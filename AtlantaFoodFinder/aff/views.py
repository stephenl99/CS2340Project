from django.http import HttpResponse
from django.shortcuts import render
from django.template import loader
from django.views import View


def index(request):
    #template = loader.get_template("html.html")
    return render(request, "aff/html.html")
    #return HttpResponse(template.render({}, request))
    #return HttpResponse("Are you hungry Atlanta?")

class MapView(View):
    template_name = "aff/index.html"
    def get(self,request):
        context = {
        }

        return render(request, self.template_name, context)